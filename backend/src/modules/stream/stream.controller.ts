import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import type { ObjectIdParams } from "../../utils/validation.js";
import {
  createStreamService,
  deleteStreamService,
  getAllStreamService,
  getStreamByIdService,
  updateStreamService,
} from "./stream.service.js";
import type { CreateStreamInput, UpdateStreamInput } from "./stream.validation.js";

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

// Get all streams
export const getStreams = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const streams = await getAllStreamService(userId);

  sendResponse(res, StatusCodes.OK, "Streams retrieved successfully", { streams });
});

// Get stream by ID
export const getStreamById = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as ObjectIdParams;
  const { userId } = req.user;

  const stream = await getStreamByIdService(id, userId);

  sendResponse(res, StatusCodes.OK, "Stream retrieved successfully", { stream });
});

// Update stream
export const updateStream = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as ObjectIdParams;
  const { userId } = req.user;
  const payload: UpdateStreamInput = req.body;

  const stream = await updateStreamService(id, userId, payload);

  sendResponse(res, StatusCodes.OK, "Stream updated successfully", { stream });
});

// Delete stream
export const deleteStream = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as ObjectIdParams;
  const { userId } = req.user;

  await deleteStreamService(id, userId);

  sendResponse(res, StatusCodes.OK, "Stream deleted successfully");
});
