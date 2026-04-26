import cron from "node-cron";
import { Log } from "../../../log/log.model.js";
import { logger } from "../../../../config/logger.js";
import { env } from "../../../../config/env.js";

const days = Number(env.CLEANUP_DAYS) || 7;
let isRunning = false;

export function startLogCleanupJob() {
  cron.schedule(
    "10 1 * * *",
    async () => {
      if (isRunning) {
        logger.warn("[cron] Skipping log cleanup, already running");
        return;
      }

      isRunning = true;

      logger.info("[cron] Log cleanup started");

      try {
        const cutoff = new Date(
          Date.now() - days * 24 * 60 * 60 * 1000
        );

        const res = await Log.deleteMany({
          checkedAt: { $lt: cutoff },
        });

        logger.info(
          `[cron] Log cleanup done. Deleted: ${res.deletedCount}`
        );

        if (res.deletedCount > 10000) {
          logger.warn(`[cron] High deletion count: ${res.deletedCount}`);
        }
      } catch (err) {
        logger.error("[cron] Log cleanup failed", err);
      } finally {
        isRunning = false;
      }
    },
    {
      timezone: "UTC",
    }
  );
}