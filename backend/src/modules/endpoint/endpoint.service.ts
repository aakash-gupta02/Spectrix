import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { CreateEndpointInput, GetEndpointsQueryInput } from "./endpoint.validation.js";
import { Endpoint } from "./endpoint.model.js";
import { Service } from "../service/service.model.js";

export const createEndpointService = async (payload: CreateEndpointInput, userId: string) => {
    const service = await Service.findOne({ _id: payload.serviceId, userId: userId });

    if (!service) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
    }

    const endpoint = await Endpoint.create({ ...payload, userId: userId });

    return endpoint;
};

export const getEndpointsService = async (user: { userId: string, role: string }, query: GetEndpointsQueryInput) => {

    const filter: Record<string, unknown> = user.role === "admin" ? {} : { userId: user.userId };

    if (query.serviceId) {
        filter.serviceId = query.serviceId;
    }

    const skip = (query.page - 1) * query.limit;

    const [endpoints, total] = await Promise.all([
        Endpoint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
        Endpoint.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / query.limit) || 1;


    return {
        endpoints,
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