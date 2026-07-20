import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import ApiError from "../../shared/utils/ApiError.js";
import { CreateEndpointInput, GetEndpointsQueryInput, UpdateEndpointInput } from "./endpoint.validation.js";
import { Endpoint } from "./endpoint.model.js";
import { Service } from "../service/service.model.js";
import {
    getLatestChecksByEndpoint,
    getPerEndpointSummaries,
} from "../stats/stats.service.js";

const METRICS_WINDOW_HOURS = 24;

const safeRound = (value: number, decimals = 2): number => {
    if (!Number.isFinite(value)) {
        return 0;
    }

    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
};

const calculateRate = (numerator: number, denominator: number) => {
    if (!denominator) {
        return 0;
    }

    return safeRound((numerator / denominator) * 100, 2);
};

const resolveHealthStatus = ({
    active,
    total,
    successRate,
}: {
    active: boolean;
    total: number;
    successRate: number;
}) => {
    if (!active) {
        return "paused";
    }

    if (total === 0) {
        return "unknown";
    }

    if (successRate >= 99) {
        return "healthy";
    }

    if (successRate >= 95) {
        return "degraded";
    }

    return "down";
};

export const createEndpointService = async (payload: CreateEndpointInput, userId: string) => {
    const service = await Service.findOne({ _id: payload.serviceId, userId: userId });

    if (!service) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
    }

    const nextCheckAt = new Date(Date.now() + 5 * 1000);

    const endpoint = await Endpoint.create({ ...payload, userId: userId, nextCheckAt });

    return endpoint;
};

export const getEndpointsService = async (user: { userId: string, role: string }, query: GetEndpointsQueryInput) => {

    const filter: Record<string, unknown> = user.role === "admin" ? {} : { userId: user.userId };

    if (query.serviceId) {
        filter.serviceId = query.serviceId;
    }

    const skip = (query.page - 1) * query.limit;

    const [endpoints, total] = await Promise.all([
        Endpoint.find(filter)
            .populate("serviceId", "name environment")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(query.limit)
            .lean(),
        Endpoint.countDocuments(filter)
    ]);

    const endpointIds = endpoints.map((endpoint) => endpoint._id as mongoose.Types.ObjectId);
    const now = new Date();
    const fromDate = new Date(now.getTime() - METRICS_WINDOW_HOURS * 60 * 60 * 1000);

    const [summaries, latestChecks] = await Promise.all([
        getPerEndpointSummaries(endpointIds, fromDate, now),
        getLatestChecksByEndpoint(endpointIds),
    ]);

    const enrichedEndpoints = endpoints.map((endpoint) => {
        const endpointId = String(endpoint._id);
        const summary = summaries.get(endpointId) || {
            total: 0,
            successChecks: 0,
            failureChecks: 0,
            avgLatency: 0,
        };
        const uptime = calculateRate(summary.successChecks, summary.total);
        const populatedService = endpoint.serviceId as unknown as {
            _id?: mongoose.Types.ObjectId;
            name?: string;
            environment?: string;
        } | null;

        const service =
            populatedService && populatedService._id
                ? {
                      id: String(populatedService._id),
                      name: populatedService.name || "-",
                      environment: populatedService.environment || null,
                  }
                : null;

        const latestCheck = latestChecks.get(endpointId) || null;

        return {
            ...endpoint,
            serviceId: service?.id || String(endpoint.serviceId || ""),
            service,
            metrics: {
                windowHours: METRICS_WINDOW_HOURS,
                uptime,
                avgLatency: summary.avgLatency,
                totalChecks: summary.total,
                successChecks: summary.successChecks,
                failureChecks: summary.failureChecks,
                healthStatus: resolveHealthStatus({
                    active: Boolean(endpoint.active),
                    total: summary.total,
                    successRate: uptime,
                }),
            },
            latestCheck: latestCheck
                ? {
                      result: latestCheck.result,
                      statusCode: latestCheck.statusCode ?? null,
                      responseTime: latestCheck.responseTime ?? null,
                      checkedAt: latestCheck.checkedAt ?? null,
                  }
                : null,
        };
    });

    const totalPages = Math.ceil(total / query.limit) || 1;


    return {
        endpoints: enrichedEndpoints,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
            hasNextPage: query.page < totalPages,
            hasPreviousPage: query.page > 1,
        },
    };
};

export const getEndpointBYIdService = async (id: string, user: { userId: string, role: string }) => {
    const filter: Record<string, unknown> = { _id: id };

    if (user.role !== "admin") {
        filter.userId = user.userId;
    }

    const endpoint = await Endpoint.findOne(filter);

    if (!endpoint) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Endpoint not found");
    }

    return endpoint;
};

export const updateEndpointService = async (id: string, user: { userId: string, role: string }, payload: UpdateEndpointInput) => {
    
    const filter: Record<string, unknown> = { _id: id };

    if (user.role !== "admin") {
        filter.userId = user.userId;
    }

    const endpoint = await Endpoint.findOneAndUpdate(filter, { $set: payload }, { new: true, runValidators: true });

    if (!endpoint) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Endpoint not found");
    }

    return endpoint;
};

export const deleteEndpointService = async (id: string, user: { userId: string, role: string }) => {
    const filter: Record<string, unknown> = { _id: id };

    if (user.role !== "admin") {
        filter.userId = user.userId;
    }

    const endpoint = await Endpoint.findOneAndDelete(filter);

    if (!endpoint) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Endpoint not found");
    }

    return endpoint;

};
