import ApiError from "../../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import type { GetLogsQueryInput } from "./log.validation.js";
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