import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../utils/ApiError.js";
import { Endpoint } from "../endpoint/endpoint.model.js";
import { Log } from "../log/log.model.js";
import type {
  GetEndpointTimeseriesQueryInput,
  GetEndpointTopLevelQueryInput,
} from "./metrics.validation.js";

type TimeseriesRequest = GetEndpointTimeseriesQueryInput & {
  endpointId: string;
};

type TopLevelRequest = GetEndpointTopLevelQueryInput & {
  endpointId: string;
};

type UserContext = {
  userId: string;
  role: string;
};

type Point = {
  time: string;
  bucketStart: Date;
  avgLatency: number;
  success: number;
  total: number;
};

const floorToBucket = (date: Date, bucketMinutes: number) => {
  const bucketMs = bucketMinutes * 60 * 1000;
  return new Date(Math.floor(date.getTime() / bucketMs) * bucketMs);
};

const safeRound = (value: number, decimals = 2): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const formatBucketTime = (date: Date, timezone: string): string => {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(date);
};

const validateTimezone = (timezone: string): void => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid timezone");
  }
};

const getWindowStats = (points: Point[]) => {
  const total = points.reduce((sum, point) => sum + point.total, 0);

  if (total === 0) {
    return {
      avgLatency: 0,
      successRate: 0,
      totalChecks: 0,
    };
  }

  const successChecks = points.reduce(
    (sum, point) => sum + (point.success / 100) * point.total,
    0
  );

  const latencyWeightedTotal = points.reduce(
    (sum, point) => sum + point.avgLatency * point.total,
    0
  );

  return {
    avgLatency: safeRound(latencyWeightedTotal / total, 2),
    successRate: safeRound((successChecks / total) * 100, 2),
    totalChecks: total,
  };
};

const getTrend = (
  previous: number,
  current: number
): { direction: "up" | "down" | "flat"; deltaPercent: number } => {
  if (previous === 0 && current === 0) {
    return { direction: "flat", deltaPercent: 0 };
  }

  if (previous === 0) {
    return { direction: "up", deltaPercent: 100 };
  }

  const deltaPercent = safeRound(((current - previous) / previous) * 100, 2);

  if (deltaPercent > 0) {
    return { direction: "up", deltaPercent };
  }

  if (deltaPercent < 0) {
    return { direction: "down", deltaPercent };
  }

  return { direction: "flat", deltaPercent: 0 };
};

const getAccessibleEndpoint = async (
  endpointId: string,
  { userId, role }: UserContext
) => {
  const endpointFilter: Record<string, unknown> = {
    _id: new mongoose.Types.ObjectId(endpointId),
  };

  if (role !== "admin") {
    endpointFilter.userId = new mongoose.Types.ObjectId(userId);
  }

  const endpoint = await Endpoint.findOne(endpointFilter).select(
    "_id name path method"
  );

  if (!endpoint) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Endpoint not found");
  }

  return endpoint;
};

const percentileFromSorted = (sortedValues: number[], p: number): number => {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = Math.max(0, Math.min(sortedValues.length - 1, Math.ceil(p * sortedValues.length) - 1));
  return sortedValues[index] ?? 0;
};

export const getEndpointTopLevelService = async (
  { endpointId, hours }: TopLevelRequest,
  user: UserContext
) => {
  const endpoint = await getAccessibleEndpoint(endpointId, user);

  const now = new Date();
  const fromDate = new Date(now.getTime() - hours * 60 * 60 * 1000);

  const matchStage = {
    endpointId: endpoint._id,
    checkedAt: {
      $gte: fromDate,
      $lte: now,
    },
  };

  const [summaryData, latestCheck, sortedLatencyData] = await Promise.all([
    Log.aggregate<{
      totalChecks: number;
      successChecks: number;
      failureChecks: number;
      avgLatency: number;
      successRate: number;
      failureRate: number;
    }>([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          successChecks: {
            $sum: {
              $cond: [{ $eq: ["$result", "success"] }, 1, 0],
            },
          },
          failureChecks: {
            $sum: {
              $cond: [{ $eq: ["$result", "failure"] }, 1, 0],
            },
          },
          avgLatency: { $avg: "$responseTime" },
        },
      },
      {
        $project: {
          _id: 0,
          totalChecks: 1,
          successChecks: 1,
          failureChecks: 1,
          avgLatency: { $round: ["$avgLatency", 2] },
          successRate: {
            $cond: [
              { $eq: ["$totalChecks", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$successChecks", "$totalChecks"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
          failureRate: {
            $cond: [
              { $eq: ["$totalChecks", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$failureChecks", "$totalChecks"] },
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
    ]),
    Log.findOne(matchStage)
      .sort({ checkedAt: -1 })
      .select("result statusCode responseTime checkedAt errorMessage"),
    Log.aggregate<{ responseTime: number }>([
      { $match: matchStage },
      { $sort: { responseTime: 1 } },
      {
        $project: {
          _id: 0,
          responseTime: 1,
        },
      },
    ]),
  ]);

  const summary = summaryData[0] || {
    totalChecks: 0,
    successChecks: 0,
    failureChecks: 0,
    avgLatency: 0,
    successRate: 0,
    failureRate: 0,
  };

  const sortedLatencies = sortedLatencyData.map((entry) => entry.responseTime);
  const p95Latency = safeRound(percentileFromSorted(sortedLatencies, 0.95), 2);

  const healthStatus =
    summary.totalChecks === 0
      ? "unknown"
      : summary.successRate >= 99
      ? "healthy"
      : summary.successRate >= 95
      ? "degraded"
      : "critical";

  return {
    endpoint: {
      id: String(endpoint._id),
      name: endpoint.name,
      method: endpoint.method,
      path: endpoint.path,
    },
    timeWindow: {
      hours,
      from: fromDate,
      to: now,
    },
    kpis: {
      totalChecks: summary.totalChecks,
      successChecks: summary.successChecks,
      failureChecks: summary.failureChecks,
      successRate: summary.successRate,
      failureRate: summary.failureRate,
      avgLatency: summary.avgLatency,
      p95Latency,
      healthStatus,
    },
    latestCheck: latestCheck
      ? {
          result: latestCheck.result,
          statusCode: latestCheck.statusCode,
          responseTime: latestCheck.responseTime,
          checkedAt: latestCheck.checkedAt,
          errorMessage: latestCheck.errorMessage,
        }
      : null,
  };
};

export const getEndpointTimeseriesService = async (
  { endpointId, hours, bucketMinutes, timezone }: TimeseriesRequest,
  { userId, role }: UserContext
) => {
  validateTimezone(timezone);

  const endpoint = await getAccessibleEndpoint(endpointId, { userId, role });

  const now = new Date();
  const fromDate = new Date(now.getTime() - hours * 60 * 60 * 1000);

  const aggregated = await Log.aggregate<{
    bucketStart: Date;
    avgLatency: number;
    total: number;
    success: number;
  }>([
    {
      $match: {
        endpointId: endpoint._id,
        checkedAt: {
          $gte: fromDate,
          $lte: now,
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
            $cond: [{ $eq: ["$result", "success"] }, 1, 0],
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
                  $multiply: [
                    { $divide: ["$successChecks", "$total"] },
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
  ]);

  const bucketMap = new Map(
    aggregated.map((item) => [new Date(item.bucketStart).getTime(), item])
  );

  const startBucket = floorToBucket(fromDate, bucketMinutes);
  const endBucket = floorToBucket(now, bucketMinutes);
  const bucketMs = bucketMinutes * 60 * 1000;

  const points: Point[] = [];

  for (
    let ts = startBucket.getTime();
    ts <= endBucket.getTime();
    ts += bucketMs
  ) {
    const item = bucketMap.get(ts);
    const bucketDate = new Date(ts);

    points.push({
      time: formatBucketTime(bucketDate, timezone),
      bucketStart: bucketDate,
      avgLatency: item ? safeRound(item.avgLatency, 2) : 0,
      success: item ? safeRound(item.success, 2) : 0,
      total: item ? item.total : 0,
    });
  }

  const midpoint = Math.max(1, Math.floor(points.length / 2));
  const previousWindow = points.slice(0, midpoint);
  const currentWindow = points.slice(midpoint);

  const previousStats = getWindowStats(previousWindow);
  const currentStats = getWindowStats(currentWindow);

  const latencyTrend = getTrend(previousStats.avgLatency, currentStats.avgLatency);
  const successTrend = getTrend(previousStats.successRate, currentStats.successRate);
  const trafficTrend = getTrend(previousStats.totalChecks, currentStats.totalChecks);

  return {
    endpoint: {
      id: String(endpoint._id),
      name: endpoint.name,
      method: endpoint.method,
      path: endpoint.path,
    },
    timeWindow: {
      hours,
      bucketMinutes,
      timezone,
      from: fromDate,
      to: now,
    },
    trends: {
      latency: {
        previous: previousStats.avgLatency,
        current: currentStats.avgLatency,
        direction: latencyTrend.direction,
        deltaPercent: latencyTrend.deltaPercent,
        lowerIsBetter: true,
      },
      successRate: {
        previous: previousStats.successRate,
        current: currentStats.successRate,
        direction: successTrend.direction,
        deltaPercent: successTrend.deltaPercent,
        higherIsBetter: true,
      },
      traffic: {
        previous: previousStats.totalChecks,
        current: currentStats.totalChecks,
        direction: trafficTrend.direction,
        deltaPercent: trafficTrend.deltaPercent,
      },
    },
    timeseries: points.map((point) => ({
      time: point.time,
      avgLatency: point.avgLatency,
      success: point.success,
      total: point.total,
      bucketStart: point.bucketStart,
    })),
  };
};
