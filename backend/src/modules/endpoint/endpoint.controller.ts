import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { createEndpointService } from "./endpoint.service.js";


export const createEndpoint = CatchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user.userId;

    const endpoint = await createEndpointService(payload, userId);

    sendResponse(res, StatusCodes.CREATED, "Endpoint created successfully", { endpoint });
});