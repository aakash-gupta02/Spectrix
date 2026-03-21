import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import type { GetLogsOverviewQueryInput, GetLogsQueryInput } from "./log.validation.js";
import { getLogsService, getMetricsOverviewService } from "./log.service.js";
import { logger } from "../../config/logger.js";


export const getLogs = CatchAsync(async (req: Request, res: Response) => {
    const { endpointId, page, limit } = req.query as unknown as GetLogsQueryInput;
    const { userId, role } = req.user;

    logger.info(`[log.controller] getLogs called by userId=${userId} with query: endpointId=${endpointId}, page=${page}, limit=${limit}`);

    const data = await getLogsService({ endpointId, page, limit }, { userId, role });

    sendResponse(res, StatusCodes.OK, "Logs Fetched Successfully", { logs: data })

});

export const metricsOverview = CatchAsync(async (req: Request, res: Response) => {
    const { userId, role } = req.user;
    const { endpointId, hours } = req.query as unknown as GetLogsOverviewQueryInput;

    const data = await getMetricsOverviewService(
        { endpointId, hours },
        { userId, role }
    );

    sendResponse(res, StatusCodes.OK, "Logs Overview Fetched Successfully", { overview: data });
});