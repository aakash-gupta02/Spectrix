import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { ingestLogsService } from "./ingest.service.js";
import { IngestLogsInput } from "./ingest.validation.js";

export const ingestLogsController = CatchAsync(
  async (req: Request, res: Response) => {
    const { logs }: IngestLogsInput = req.body;

    console.log(logs);

    await ingestLogsService(logs);

    sendResponse(res, StatusCodes.OK, "Logs ingested successfully");
  },
);
