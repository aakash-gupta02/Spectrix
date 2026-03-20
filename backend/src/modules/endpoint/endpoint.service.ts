import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { CreateEndpointInput } from "./endpoint.validation.js";
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