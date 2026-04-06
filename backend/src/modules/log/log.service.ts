import mongoose from "mongoose";
import type { GetLogsOverviewQueryInput, GetLogsQueryInput } from "./log.validation.js";
import { Log } from "./log.model.js";


export const getLogsService = async ({ endpointId, page, limit }: GetLogsQueryInput, { userId, role }: { userId: string; role: string }) => {

    const filter: Record<string, unknown> = role === "admin" ? {} : { userId: userId };

    if (endpointId) {
        filter.endpointId = endpointId;
    }

    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
        Log.countDocuments(filter),
        Log.find(filter).sort({ checkedAt: -1 }).skip(skip).limit(limit)
        .populate("endpointId", "name method path")
        .select("-__v -userId -createdAt -updatedAt")
    ])

    const totalPages = Math.ceil(total / limit) || 1;

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };

};

export const getMetricsOverviewService = async (
    { endpointId, hours }: GetLogsOverviewQueryInput,
    { userId, role }: { userId: string; role: string }
) => {
    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const baseFilter: Record<string, unknown> = {
        checkedAt: { $gte: fromDate },
        ...(role === "admin" ? {} : { userId: new mongoose.Types.ObjectId(userId) }),
    };

    if (endpointId) {
        baseFilter.endpointId = new mongoose.Types.ObjectId(endpointId);
    }

    const [summaryData, endpointBreakdown] = await Promise.all([
        Log.aggregate([
            { $match: baseFilter },
            {
                $group: {
                    _id: null,
                    totalChecks: { $sum: 1 },
                    successChecks: {
                        $sum: {
                            $cond: [{ $eq: ["$result", "success"] }, 1, 0]
                        }
                    },
                    failureChecks: {
                        $sum: {
                            $cond: [{ $eq: ["$result", "failure"] }, 1, 0]
                        }
                    },
                    avgResponseTime: { $avg: "$responseTime" },
                    lastCheckedAt: { $max: "$checkedAt" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalChecks: 1,
                    successChecks: 1,
                    failureChecks: 1,
                    avgResponseTime: { $round: ["$avgResponseTime", 2] },
                    successRate: {
                        $cond: [
                            { $eq: ["$totalChecks", 0] },
                            0,
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$successChecks", "$totalChecks"] },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            }
                        ]
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
                                            100
                                        ]
                                    },
                                    2
                                ]
                            }
                        ]
                    },
                    lastCheckedAt: 1,
                }
            }
        ]),
        Log.aggregate([
            { $match: baseFilter },
            {
                $group: {
                    _id: "$endpointId",
                    totalChecks: { $sum: 1 },
                    successChecks: {
                        $sum: {
                            $cond: [{ $eq: ["$result", "success"] }, 1, 0]
                        }
                    },
                    failureChecks: {
                        $sum: {
                            $cond: [{ $eq: ["$result", "failure"] }, 1, 0]
                        }
                    },
                    avgResponseTime: { $avg: "$responseTime" },
                    lastCheckedAt: { $max: "$checkedAt" }
                }
            },
            {
                $lookup: {
                    from: "endpoints",
                    localField: "_id",
                    foreignField: "_id",
                    as: "endpoint"
                }
            },
            {
                $unwind: {
                    path: "$endpoint",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    endpointId: "$_id",
                    endpointName: "$endpoint.name",
                    method: "$endpoint.method",
                    path: "$endpoint.path",
                    totalChecks: 1,
                    successChecks: 1,
                    failureChecks: 1,
                    avgResponseTime: { $round: ["$avgResponseTime", 2] },
                    successRate: {
                        $cond: [
                            { $eq: ["$totalChecks", 0] },
                            0,
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$successChecks", "$totalChecks"] },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            }
                        ]
                    },
                    lastCheckedAt: 1
                }
            },
            { $sort: { failureChecks: -1, totalChecks: -1 } },
            { $limit: 20 }
        ])
    ]);

    const summary = summaryData[0] || {
        totalChecks: 0,
        successChecks: 0,
        failureChecks: 0,
        avgResponseTime: 0,
        successRate: 0,
        failureRate: 0,
        lastCheckedAt: null,
    };

    return {
        timeWindow: {
            hours,
            from: fromDate,
            to: new Date(),
        },
        summary,
        endpointBreakdown,
    };
};