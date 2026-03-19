import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import type { CreateServiceInput, UpdateServiceInput } from "./service.validation.js";
import { Service } from "./service.model.js";

// Service service functions
export const createServiceSrvc = async (payload: CreateServiceInput, userId: string) => {

    const service = await Service.create({ ...payload, userId: userId });

    return service;
};

// Get a service by ID srvc
export const getServicesByIdSrvc = async (serviceId: string, userId: string) => {

    const service = await Service.findOne({ _id: serviceId, userId: userId });

    if (!service) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
    }

    return service;
};

// Update a service by ID srvc
export const updateServiceSrvc = async (serviceId: string, payload: UpdateServiceInput, userId: string) => {

    const service = await Service.findByIdAndUpdate(
        { _id: serviceId, userId: userId },
        { $set: payload },
        { new: true, runValidators: true }
    );

    if (!service) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
    }

    return service;
};

// Delete a service by ID srvc
export const deleteServiceSrvc = async (serviceId: string, userId: string) => {

    const service = await Service.findOneAndDelete({ _id: serviceId, userId: userId });

    if (!service) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
    }

    return;

};