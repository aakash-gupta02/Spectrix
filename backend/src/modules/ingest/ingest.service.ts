import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { logger } from "../../config/logger.js";
import { LogInput } from "./ingest.validation.js";
import { streamEmitter } from "./emitter.js";

export const ingestLogsService = async (logs: LogInput[]) => {
  logger.info(`Received ${logs.length} logs for ingestion`);

  // emit realtime event
  streamEmitter.emit("logs", logs);

  return;
};
