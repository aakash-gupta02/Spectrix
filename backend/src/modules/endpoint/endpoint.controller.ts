import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { createEndpointService, deleteEndpointService, getEndpointBYIdService, getEndpointsService, updateEndpointService } from "./endpoint.service.js";
import type { CreateEndpointInput, EndpointIdParams, GetEndpointsQueryInput, UpdateEndpointInput } from "./endpoint.validation.js";

// Create a new endpoint
export const createEndpoint = CatchAsync(async (req: Request, res: Response) => {
    const payload: CreateEndpointInput = req.body;
    const userId = req.user.userId;

    const endpoint = await createEndpointService(payload, userId);

    sendResponse(res, StatusCodes.CREATED, "Endpoint created successfully", { endpoint });
});

// Get all endpoints
export const getEndpoints = CatchAsync(async (req: Request, res: Response) => {
    const { userId, role } = req.user;
    const query = req.query as unknown as GetEndpointsQueryInput;

    const endpoints = await getEndpointsService({ userId, role }, query);

    sendResponse(res, StatusCodes.OK, "Endpoints retrieved successfully", { endpoints });
});

// Get endpoint by ID
export const getEndpointById = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as unknown as EndpointIdParams;
    const { userId, role } = req.user;

    const endpoint = await getEndpointBYIdService(id, { userId, role });
    sendResponse(res, StatusCodes.OK, "Endpoint retrieved successfully", { endpoint });

});

// Update endpoint
export const updateEndpoint = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as unknown as EndpointIdParams;
    const { userId, role } = req.user;
    const payload: UpdateEndpointInput = req.body;

    const endpoint = await updateEndpointService(id, { userId, role }, payload);
    sendResponse(res, StatusCodes.OK, "Endpoint updated successfully", { endpoint });

});


// Delete endpoint
export const deleteEndpoint = CatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as unknown as EndpointIdParams;
    const { userId, role } = req.user;

    await deleteEndpointService(id, { userId, role });
    
    sendResponse(res, StatusCodes.OK, "Endpoint deleted successfully");
})
