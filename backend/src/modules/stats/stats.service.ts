import { logger } from "../../config/logger.js";
import { Log } from "../log/log.model.js";
import { DailyStats } from "./daily/endpointStats.model.js";

function getYesterdayRangeUTC() {
  const now = new Date();

  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 1,
    0, 0, 0, 0
  ));

  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 1,
    23, 59, 59, 999
  ));

  return { start, end };
}

export async function aggregateDailyStats() {
  const { start, end } = getYesterdayRangeUTC();

  logger.info(`[stats] Aggregating logs from ${start.toISOString()} → ${end.toISOString()}`);

  const results = await Log.aggregate([
    {
      $match: {
        checkedAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          endpointId: "$endpointId",
          serviceId: "$serviceId",
          userId: "$userId",
        },

        totalRequests: { $sum: 1 },

        successedRequests: {
          $sum: {
            $cond: [{ $eq: ["$result", "success"] }, 1, 0],
          },
        },

        failedRequests: {
          $sum: {
            $cond: [{ $eq: ["$result", "failure"] }, 1, 0],
          },
        },

        totalResponseTime: { $sum: "$responseTime" },
      },
    },
  ]);

  logger.info(`[stats] Aggregated ${results.length} endpoint groups`);

  // 🧠 Bulk write (IMPORTANT for performance)
  const operations = results.map((r) => {
    const avg =
      r.totalRequests > 0
        ? r.totalResponseTime / r.totalRequests
        : 0;

    return {
      updateOne: {
        filter: {
          endpointId: r._id.endpointId,
          date: start,
        },
        update: {
          $set: {
            endpointId: r._id.endpointId,
            serviceId: r._id.serviceId,
            userId: r._id.userId,

            date: start,

            totalRequests: r.totalRequests,
            successedRequests: r.successedRequests,
            failedRequests: r.failedRequests,

            totalResponseTime: r.totalResponseTime,
            averageResponseTime: avg,
          },
        },
        upsert: true,
      },
    };
  });

  if (operations.length > 0) {
    await DailyStats.bulkWrite(operations);
  }

  logger.info(`[stats] Daily stats saved successfully`);
}