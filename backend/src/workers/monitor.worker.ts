import { Endpoint } from "../modules/endpoint/endpoint.model.js";
import "../modules/service/service.model.js";
import { calculateNextCheckAt, retryApiCheck, retryRunCheck, runCheck } from "./runner.js";
import { connectDB } from "../config/db.js";
import { logger } from "../config/logger.js";
import { Log } from "../modules/log/log.model.js";
import { handleIncidentService } from "../modules/incident/incident.service.js";
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
        endpoints.map(async (endpoint) => {
          try {
            const checkedAt = new Date();

            const result = await retryApiCheck(endpoint);

            if (!result) {
              throw new Error("retryApiCheck returned undefined");
            }

            // Log the result
            await Log.create({
              endpointId: endpoint._id,
              serviceId: endpoint.serviceId,
              userId: endpoint.userId,
              result: result.result,
              statusCode: result.statusCode,
              responseTime: result.responseTime,
              errorMessage: result.errorMessage,
            });

            // Incident
            await handleIncidentService(endpoint, result.result, checkedAt);

            // Schedule next check
            const nextCheckAt = calculateNextCheckAt(endpoint);

            await Endpoint.updateOne({ _id: endpoint._id }, { nextCheckAt });

            return "fulfilled";
          } catch (err) {
            throw err;
          }
        }),
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
