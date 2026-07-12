import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getStatuspageService } from "./statuspage.service.js";
import sendResponse from "../../shared/utils/ApiResponse.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import { StatuspageParamsInput } from "./statuspage.validation.js";

export const getStatuspage = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as StatuspageParamsInput;

  const statuspage = await getStatuspageService(id);

  sendResponse(res, StatusCodes.OK, "Statuspage fetched successfully", {
    statuspage,
  });
});
