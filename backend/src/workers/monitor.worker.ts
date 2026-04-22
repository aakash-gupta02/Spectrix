import { Endpoint } from "../modules/endpoint/endpoint.model.js";
import "../modules/service/service.model.js";
import { calculateNextCheckAt, retryApiCheck } from "./runner.js";
import { connectDB } from "../config/db.js";
import { logger } from "../config/logger.js";
import { Log } from "../modules/log/log.model.js";
import { handleIncidentService } from "../modules/incident/incident.service.js";
import type { EndpointWithService } from "../modules/alert/alert.formatter.js";
import { env } from "../config/env.js";
const POLL_INTERVAL = 5000; // 5 seconds - ms value

export async function runWorker() {
  logger.info("[worker] Monitoring worker started");
  // await connectDB();

  setInterval(async () => {
    try {
      // Find endpoints that are due for a check
      const endpoints = await Endpoint.find({
        nextCheckAt: { $lte: new Date() },
        active: true,
      })
        .populate("serviceId", "baseUrl name environment")
        .lean<EndpointWithService[]>(); // lean + populated for clean typing + faster worker

      const populatedEndpoints = endpoints;

      // Run checks in parallel but still observe each failure.
      logger.info(
        `[worker] Poll started with ${endpoints.length} active endpoints`,
      );

      // Process each endpoint check with retry logic and log results
      const results = await Promise.allSettled(
        populatedEndpoints.map(async (endpoint) => {
          try {
            const checkedAt = new Date();

            const result = await retryApiCheck(endpoint);

            if (!result) {
              throw new Error("retryApiCheck returned undefined");
            }

            // Log the result
            await Log.create({
              endpointId: endpoint._id,
              serviceId: endpoint.serviceId._id,
              userId: endpoint.userId,
              result: result.result,
              statusCode: result.statusCode,
              responseTime: result.responseTime,
              errorMessage: result.errorMessage,
              errorType: result.errorType,
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

      // Count failed checks and log errors
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          failedCount += 1;
          const endpointId = populatedEndpoints[index]?._id;
          logger.error(
            `[worker] retryRunCheck failed for endpoint ${endpointId}: ${String(result.reason)}`,
          );
        }
      });

      // Log summary of the poll results
      logger.info(
        `[worker] Poll completed: total=${results.length} rejected=${failedCount} fulfilled=${results.length - failedCount}`,
      );
    } catch (err) {
      logger.error(`[worker] Worker error: ${String(err)}`);
    }
  }, POLL_INTERVAL);
}

export function startWorkerIfEnabled() {
  try {
    if (env.RUN_WORKERS === "true") {
      logger.info("[worker] Starting worker...");
      runWorker();
    }
  } catch (err) {
    logger.error(`[worker] Worker failed to start: ${String(err)}`);
  }
}

// startWorkerIfEnabled();
