import cron from "node-cron";
import { Log } from "../../../log/log.model.js";
import { logger } from "../../../../config/logger.js";
import { env } from "../../../../config/env.js";

const days = Number(env.CLEANUP_DAYS) || 7;
const failureDate = Number(env.CLEANUP_FAILURE_DAYS) || 15;

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
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const failureCutoff = new Date(
          Date.now() - failureDate * 24 * 60 * 60 * 1000,
        );

        // Delete successful logs older than cutoff and failed logs older than failureCutoff
        const successRes = await Log.deleteMany({
          checkedAt: { $lt: cutoff },
          result: "success",
        });

        const failureRes = await Log.deleteMany({
          checkedAt: { $lt: failureCutoff },
          result: "failure",
        });

        logger.info(
          `[cron] Log cleanup done. Deleted: ${successRes.deletedCount} successful, ${failureRes.deletedCount} failed`,
        );

        if (
          successRes.deletedCount > 10000 ||
          failureRes.deletedCount > 10000
        ) {
          logger.warn(
            `[cron] High deletion count: ${successRes.deletedCount} successful, ${failureRes.deletedCount} failed`,
          );
        }
      } catch (err) {
        logger.error("[cron] Log cleanup failed", err);
      } finally {
        isRunning = false;
      }
    },
    {
      timezone: "UTC",
    },
  );
}
