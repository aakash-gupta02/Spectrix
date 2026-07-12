import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createStatuspageService,
  deleteStatuspageService,
  getStatuspageService,
  updateStatuspageService,
} from "./statuspage.service.js";
import sendResponse from "../../shared/utils/ApiResponse.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import {
  StatuspageParamsInput,
  StatuspageSlugParamsInput,
} from "./statuspage.validation.js";

// create a statuspage
export const createStatuspage = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const statuspageData = req.body;

    const statuspage = await createStatuspageService(statuspageData, userId);

    sendResponse(res, StatusCodes.CREATED, "Statuspage created successfully", {
      statuspage,
    });
  },
);

// update a statuspage
export const updateStatuspage = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const statuspageData = req.body;

    const statuspage = await updateStatuspageService(statuspageData, userId);

    sendResponse(res, StatusCodes.OK, "Statuspage updated successfully", {
      statuspage,
    });
  },
);

// delete a statuspage
export const deleteStatuspage = CatchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  await deleteStatuspageService(userId);

  sendResponse(res, StatusCodes.OK, "Statuspage deleted successfully");
});

// get loggedIn user's statuspage
export const getStatuspage = CatchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const statuspage = await getStatuspageService(userId);

  sendResponse(res, StatusCodes.OK, "Statuspage fetched successfully", {
    statuspage,
  });
});

// get Statuspage by Slug
export const getStatuspageBySlug = CatchAsync(
  async (req: Request, res: Response) => {
    const { slug } = req.params as StatuspageSlugParamsInput;

    const statuspage = await getStatuspageService(slug);

    sendResponse(res, StatusCodes.OK, "Statuspage fetched successfully", {
      statuspage,
    });
  },
);
