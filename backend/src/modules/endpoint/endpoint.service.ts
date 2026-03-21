import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { CreateEndpointInput, GetEndpointsQueryInput, UpdateEndpointInput } from "./endpoint.validation.js";
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