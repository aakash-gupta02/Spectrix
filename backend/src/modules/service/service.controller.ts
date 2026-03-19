import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { createServiceSrvc, deleteServiceSrvc, getServicesByIdSrvc, updateServiceSrvc } from "./service.service.js";
import type { CreateServiceInput, ServiceIdParamsInput, UpdateServiceInput } from "./service.validation.js";

// Create a new service
export const createService = CatchAsync(async (req: Request, res: Response) => {

    const payload: CreateServiceInput = req.body;
    const userId = req.user.userId;

    const serviceData = await createServiceSrvc(payload, userId);

    sendResponse(res, StatusCodes.CREATED, "Service created successfully", { service: serviceData });

});

export const getServices = CatchAsync(async (req: Request, res: Response) => {
    // Placeholder for fetching services logic
    sendResponse(res, StatusCodes.OK, "Services fetched successfully", { /* services data */ });
});

// Get a service by ID
export const getServiceById = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as ServiceIdParamsInput;
    const userId = req.user.userId;

    const serviceData = await getServicesByIdSrvc(id, userId);


    sendResponse(res, StatusCodes.OK, "Service fetched successfully", { service: serviceData });
});

// Update a service by ID
export const updateService = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as ServiceIdParamsInput;
    const payload: UpdateServiceInput = req.body;
    const userId = req.user.userId;

    const updatedService = await updateServiceSrvc(id, payload, userId);

    sendResponse(res, StatusCodes.OK, "Service updated successfully", { service: updatedService });
});

// Delete a service by ID
export const deleteService = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as ServiceIdParamsInput;
    const userId = req.user.userId;

    await deleteServiceSrvc(id, userId);


    sendResponse(res, StatusCodes.OK, "Service deleted successfully");
});
