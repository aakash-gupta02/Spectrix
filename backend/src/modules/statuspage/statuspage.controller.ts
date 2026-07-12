import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getStatuspageService } from "./statuspage.service.js";
import sendResponse from "../../shared/utils/ApiResponse.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";

export const getStatuspage = CatchAsync(async (req: Request, res: Response) => {
    const statuspage = await getStatuspageService(req.params.id);

    sendResponse(res, StatusCodes.OK, "Statuspage fetched successfully",
        statuspage,
    );

});
