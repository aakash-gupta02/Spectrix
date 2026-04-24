import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { startDailyStatsJob } from "../modules/stats/daily/jobs/dailyStats.job.js";
import { startLogCleanupJob } from "../modules/stats/daily/jobs/logCleanup.job.js";

export function startCronJobsIfEnabled() {
  try {
    if (env.RUN_CRONS === "true") {
      logger.info("[cron] Starting cron jobs...");

      startDailyStatsJob();
      startLogCleanupJob();
    }
  } catch (err) {
    logger.error(`[cron] Failed to start cron jobs: ${String(err)}`);
  }
};