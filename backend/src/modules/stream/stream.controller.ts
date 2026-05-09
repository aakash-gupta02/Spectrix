import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { createStreamService } from "./stream.service.js";
import type { CreateStreamInput } from "./stream.validation.js";

// Create a new stream
export const createStream = CatchAsync(async (req: Request, res: Response) => {
  const payload: CreateStreamInput = req.body;
  const userId = req.user.userId;

  const { stream, rawKey } = await createStreamService(payload, userId);

  sendResponse(res, StatusCodes.CREATED, "Stream created successfully", { 
    stream,
    rawKey 
  });
});
