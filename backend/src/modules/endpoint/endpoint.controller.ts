import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { createEndpointService, getEndpointsService } from "./endpoint.service.js";
import { type GetEndpointsQueryInput } from "./endpoint.validation.js";

// Create a new endpoint
export const createEndpoint = CatchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user.userId;

    const endpoint = await createEndpointService(payload, userId);

    sendResponse(res, StatusCodes.CREATED, "Endpoint created successfully", { endpoint });
});

export const getEndpoints = CatchAsync(async (req: Request, res: Response) => {
    const {userId, role} = req.user;
    const query = req.query as unknown as GetEndpointsQueryInput;
    
    const endpoints = await getEndpointsService({userId, role}, query);

    sendResponse(res, StatusCodes.OK, "Endpoints retrieved successfully", { endpoints });
});