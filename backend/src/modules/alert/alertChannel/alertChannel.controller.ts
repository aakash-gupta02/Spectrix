import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../utils/ApiResponse.js";
import CatchAsync from "../../../utils/CatchAsync.js";
import { createAlertChannelService } from "./alertChannel.service.js";
import type { CreateAlertChannelInput } from "./alertChannel.validation.js";

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
