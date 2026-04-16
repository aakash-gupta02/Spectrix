import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../utils/ApiResponse.js";
import CatchAsync from "../../../utils/CatchAsync.js";
import {
  createAlertChannelService,
  deleteAlertChannelService,
  getAlertChannelsService,
} from "./alertChannel.service.js";
import type {
  AlertChannelIdParam,
  CreateAlertChannelInput,
} from "./alertChannel.validation.js";

// Create a new alert channel for the user
export const createAlertChannel = CatchAsync(
  async (req: Request, res: Response) => {
    const body: CreateAlertChannelInput = req.body;
    const userId = req.user.userId;

    const alertChannel = await createAlertChannelService(userId, body);

    sendResponse(
      res,
      StatusCodes.CREATED,
      "Alert channel created successfully",
      { alertChannel },
    );
  },
);

// Get all alert channels for the user
export const getAlertChannels = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const alertChannels = await getAlertChannelsService(userId);

    sendResponse(res, StatusCodes.OK, "Alert channels retrieved successfully", {
      alertChannels,
    });
  },
);

// Delete an alert channel for the user
export const deleteAlertChannel = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { id } = req.params as unknown as AlertChannelIdParam;

    await deleteAlertChannelService(userId, id);

    sendResponse(res, StatusCodes.OK, "Alert channel deleted successfully");
  },
);
