import type { Request, Response } from "express";
import { CacheTTL, CacheKeys, cache } from "../../core/cache/index.js";
import crypto from "crypto";
import { setCookie } from "../../shared/utils/SetCookie.js";
import { Statuspage } from "./statuspage.model.js";
import { logger } from "../../core/config/logger.js";
import cron from "node-cron";

const spxCookieName = "spectrix_visitor_session_id";

export const trackViews = async (slug: string, sessionId: string) => {
  const visitorKey = CacheKeys.statusPage.visitor(slug, sessionId);
  const viewsKey = CacheKeys.statusPage.views(slug);

  // check existing view
  const existingView = await cache.exists(visitorKey);

  if (existingView) {
    return;
  }

  // mark visitor for 24 hour
  await cache.setValue(visitorKey, "1", CacheTTL.ONE_DAY);

  // increment views
  await cache.increment(viewsKey);

  // add to active statuspage set
  await cache.addToSet(CacheKeys.statusPage.active, slug);
};

export const getView = async (slug: string) => {
  const viewsKey = CacheKeys.statusPage.views(slug);
  const views = await cache.get(viewsKey);

  return views || 0;
};

export const getOrCreateVisitorId = async (
  req: Request,
  res: Response,
): Promise<string> => {
  let sessionId = req.cookies[spxCookieName];

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(res, spxCookieName, sessionId, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }
  return sessionId;
};

export const syncViews = async () => {
  const slugs = await cache.getSetMembers(CacheKeys.statusPage.active);

  for (const slug of slugs) {
    const views = await cache.getDel<number>(CacheKeys.statusPage.views(slug));

    if (!views) continue;

    try {
      await Statuspage.updateOne(
        { slug },
        {
          $inc: { views },
        },
      );

      await cache.removeFromSet(CacheKeys.statusPage.active, slug);
    } catch (error) {
      await cache.incrementBy(CacheKeys.statusPage.views(slug), views);

      await cache.addToSet(CacheKeys.statusPage.active, slug);

      logger.error(`Failed to sync views for statuspage ${slug}: ${error}`);
    }
  }
};

export const startSyncViewsJob = () => {
  cron.schedule(
    "*/5 * * * *",
    async () => {
      try {
        logger.info("[cron] Syncing statuspage views...");

        await syncViews();

        logger.info("[cron] Statuspage views synced");
      } catch (error) {
        logger.error("[cron] Failed to sync statuspage views", error);
      }
    },
    {
      timezone: "UTC",
    },
  );
};

export const invalidateStatusPageCache = async (slug: string) => {
  await cache.del(CacheKeys.statusPage.page(slug));
  logger.debug(`Invalidating cache for statuspage: ${slug}`);
};
