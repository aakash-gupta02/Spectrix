import type { Request, Response } from "express";
import { CacheTTL, CacheKeys, cache } from "../../core/cache/index.js";
import crypto from "crypto";
import { setCookie } from "../../shared/utils/SetCookie.js";

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
