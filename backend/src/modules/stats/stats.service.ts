import mongoose from "mongoose";
import { logger } from "../../config/logger.js";
import { Log } from "../log/log.model.js";
import { DailyStats } from "./daily/endpointStats.model.js";

type UserContext = {
  userId: string;
  role: string;
};

type MetricsSummary = {
  total: number;
  successChecks: number;
  failureChecks: number;
  avgLatency: number;
};

type TimeseriesPoint = {
  bucketStart: Date;
  avgLatency: number;
  total: number;
  success: number;
};

const safeRound = (value: number, decimals = 2): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const failureSignalExpression = {
  $or: [
    { $in: ["$result", ["failure", "failed", "error"]] },
    {
      $and: [{ $ne: ["$statusCode", null] }, { $gte: ["$statusCode", 400] }],
    },
    { $ne: [{ $ifNull: ["$errorMessage", null] }, null] },
  ],
};

const successSignalExpression = {
  $and: [
    { $not: [failureSignalExpression] },
    {
      $or: [
        { $eq: ["$result", "success"] },
        {
          $and: [
            { $ne: ["$statusCode", null] },
            { $gte: ["$statusCode", 200] },
            { $lt: ["$statusCode", 400] },
          ],
        },
      ],
    },
  ],
};

const startOfUtcDay = (date: Date) =>
  new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

function getYesterdayRangeUTC() {
  const now = new Date();

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,
      0,
      0,
      0,
      0,
    ),
  );

  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,
      23,
      59,
      59,
      999,
    ),
  );

  return { start, end };
}

export async function aggregateDailyStats() {
  const { start, end } = getYesterdayRangeUTC();

  logger.info(
    `[stats] Aggregating logs from ${start.toISOString()} → ${end.toISOString()}`,
  );

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

        successRequests: {
          $sum: {
            $cond: [successSignalExpression, 1, 0],
          },
        },

        failedRequests: {
          $sum: {
            $cond: [failureSignalExpression, 1, 0],
          },
        },

        totalResponseTime: { $sum: "$responseTime" },
      },
    },
  ]);

  logger.info(`[stats] Aggregated ${results.length} endpoint groups`);

  // Bulk write is used here to keep daily aggregation fast.
  const operations = results.map((r) => {
    const avg = r.totalRequests > 0 ? r.totalResponseTime / r.totalRequests : 0;

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
            successRequests: r.successRequests,
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

export async function getSummaryUsingDailyStatsAndTodayLogs(
  endpointIds: mongoose.Types.ObjectId[],
  fromDate: Date,
  toDate: Date,
): Promise<MetricsSummary> {
  if (endpointIds.length === 0) {
    return {
      total: 0,
      successChecks: 0,
      failureChecks: 0,
      avgLatency: 0,
    };
  }

  const todayStartUtc = startOfUtcDay(toDate);
  const endOfYesterdayUtc = new Date(todayStartUtc.getTime() - 1);

  const dailyStatsFrom = startOfUtcDay(fromDate);
  const dailyStatsTo =
    endOfYesterdayUtc >= fromDate ? endOfYesterdayUtc : null;

  const logFrom = fromDate > todayStartUtc ? fromDate : todayStartUtc;

  const [statsSummary, logsSummary] = await Promise.all([
    dailyStatsTo
      ? DailyStats.aggregate<{
          total: number;
          successChecks: number;
          failureChecks: number;
          totalResponseTime: number;
        }>([
          {
            $match: {
              endpointId: { $in: endpointIds },
              date: {
                $gte: dailyStatsFrom,
                $lte: dailyStatsTo,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalRequests" },
              successChecks: {
                $sum: {
                  $ifNull: ["$successRequests", "$successedRequests"],
                },
              },
              failureChecks: { $sum: "$failedRequests" },
              totalResponseTime: { $sum: "$totalResponseTime" },
            },
          },
        ])
      : Promise.resolve([]),
    logFrom <= toDate
      ? Log.aggregate<{
          total: number;
          successChecks: number;
          failureChecks: number;
          totalResponseTime: number;
        }>([
          {
            $match: {
              endpointId: { $in: endpointIds },
              checkedAt: {
                $gte: logFrom,
                $lte: toDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              successChecks: {
                $sum: {
                  $cond: [successSignalExpression, 1, 0],
                },
              },
              failureChecks: {
                $sum: {
                  $cond: [failureSignalExpression, 1, 0],
                },
              },
              totalResponseTime: { $sum: "$responseTime" },
            },
          },
        ])
      : Promise.resolve([]),
  ]);

  const stats = statsSummary[0] ?? {
    total: 0,
    successChecks: 0,
    failureChecks: 0,
    totalResponseTime: 0,
  };

  const logs = logsSummary[0] ?? {
    total: 0,
    successChecks: 0,
    failureChecks: 0,
    totalResponseTime: 0,
  };

  const total = stats.total + logs.total;
  const successChecks = stats.successChecks + logs.successChecks;
  const failureChecks = stats.failureChecks + logs.failureChecks;
  const totalResponseTime = stats.totalResponseTime + logs.totalResponseTime;

  return {
    total,
    successChecks,
    failureChecks,
    avgLatency: total > 0 ? safeRound(totalResponseTime / total, 2) : 0,
  };
}

export async function getTimeseriesUsingDailyStatsAndTodayLogs(
  endpointId: mongoose.Types.ObjectId,
  fromDate: Date,
  toDate: Date,
  bucketMinutes: number,
): Promise<TimeseriesPoint[]> {
  const todayStartUtc = startOfUtcDay(toDate);
  const historicalFromDay = startOfUtcDay(fromDate);
  const endOfYesterdayUtc = new Date(todayStartUtc.getTime() - 1);

  const logFrom = fromDate > todayStartUtc ? fromDate : todayStartUtc;

  const [historicalStats, todayLogs] = await Promise.all([
    historicalFromDay <= endOfYesterdayUtc
      ? DailyStats.aggregate<{
          bucketStart: Date;
          avgLatency: number;
          total: number;
          success: number;
        }>([
          {
            $match: {
              endpointId,
              date: {
                $gte: historicalFromDay,
                $lte: endOfYesterdayUtc,
              },
            },
          },
          {
            $project: {
              _id: 0,
              bucketStart: "$date",
              avgLatency: { $round: ["$averageResponseTime", 2] },
              total: "$totalRequests",
              success: {
                $cond: [
                  { $eq: ["$totalRequests", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $ifNull: [
                                  "$successRequests",
                                  "$successedRequests",
                                ],
                              },
                              "$totalRequests",
                            ],
                          },
                          100,
                        ],
                      },
                      2,
                    ],
                  },
                ],
              },
            },
          },
          { $sort: { bucketStart: 1 } },
        ])
      : Promise.resolve([]),
    logFrom <= toDate
      ? Log.aggregate<{
          bucketStart: Date;
          avgLatency: number;
          total: number;
          success: number;
        }>([
          {
            $match: {
              endpointId,
              checkedAt: {
                $gte: logFrom,
                $lte: toDate,
              },
            },
          },
          {
            $group: {
              _id: {
                $dateTrunc: {
                  date: "$checkedAt",
                  unit: "minute",
                  binSize: bucketMinutes,
                },
              },
              avgLatency: { $avg: "$responseTime" },
              total: { $sum: 1 },
              successChecks: {
                $sum: {
                  $cond: [successSignalExpression, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              bucketStart: "$_id",
              avgLatency: { $round: ["$avgLatency", 2] },
              total: 1,
              success: {
                $cond: [
                  { $eq: ["$total", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [{ $divide: ["$successChecks", "$total"] }, 100],
                      },
                      2,
                    ],
                  },
                ],
              },
            },
          },
          { $sort: { bucketStart: 1 } },
        ])
      : Promise.resolve([]),
  ]);

  const combined = [...historicalStats, ...todayLogs]
    .map((point) => ({
      bucketStart: new Date(point.bucketStart),
      avgLatency: safeRound(point.avgLatency ?? 0, 2),
      total: point.total ?? 0,
      success: safeRound(point.success ?? 0, 2),
    }))
    .sort((a, b) => a.bucketStart.getTime() - b.bucketStart.getTime());

  return combined;
}

export async function getStatsByEndpoint(
  endpointId: string,
  user: UserContext,
) {
  const endpointFilter: Record<string, unknown> =
    user.role === "admin" ? {} : { userId: user.userId };

  const stats = await DailyStats.find({
    endpointId,
    ...endpointFilter,
  }).lean();

  return stats;
}

export async function getStatsByService(serviceId: string, user: UserContext) {
  const serviceFilter: Record<string, unknown> =
    user.role === "admin" ? {} : { userId: user.userId };

  const stats = await DailyStats.find({
    serviceId,
    ...serviceFilter,
  }).lean();

  return stats;
}
