import cron from "node-cron";
import { logger } from "../../../../config/logger.js";
import { aggregateDailyStats } from "../../stats.service.js";

let isRunning = false;

export function startDailyStatsJob() {
  cron.schedule(
    "0 1 * * *", // Daily at 1:00 AM
    async () => {
      if (isRunning) {
        logger.warn("[cron] Skipping, already running");
        return;
      }

      isRunning = true;

      try {
        await aggregateDailyStats();
      } catch (err) {
        logger.error("[cron] Aggregation failed", err);
      } finally {
        isRunning = false;
      }
    },
    {
      timezone: "UTC",
    },
  );
}
