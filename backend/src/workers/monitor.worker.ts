import { Endpoint } from "../modules/endpoint/endpoint.model.js";
import "../modules/service/service.model.js";
import { retryRunCheck, runCheck } from "./runner.js";
import { connectDB } from "../config/db.js";
import { logger } from "../config/logger.js";
const POLL_INTERVAL = 5000; // 5 seconds - ms value

async function runWorker() {
  logger.info("[worker] Monitoring worker started");
  await connectDB();

  setInterval(async () => {
    try {
      const endpoints = await Endpoint.find({
        nextCheckAt: { $lte: new Date() },
        active: true,
      }).populate("serviceId", "baseUrl"); // populate service's baseUrl

      // Run checks in parallel but still observe each failure.
      logger.info(
        `[worker] Poll started with ${endpoints.length} active endpoints`,
      );
      const results = await Promise.allSettled(
        endpoints.map((endpoint) => retryRunCheck(endpoint)),
      );

      let failedCount = 0;

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          failedCount += 1;
          const endpointId = (endpoints[index] as any)?._id;
          logger.error(
            `retryRunCheck failed for endpoint ${endpointId}: ${String(result.reason)}`,
          );
        }
      });

      logger.info(
        `[worker] Poll completed: total=${results.length} rejected=${failedCount} fulfilled=${results.length - failedCount}`,
      );
    } catch (err) {
      logger.error(`Worker error: ${String(err)}`);
    }
  }, POLL_INTERVAL);
}

runWorker();
