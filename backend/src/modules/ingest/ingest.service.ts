import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import { logger } from "../../config/logger.js";
import { LogInput } from "./ingest.validation.js";
import { streamEmitter } from "./emitter.js";
import { Service } from "../service/service.model.js";
import { createStreamToken } from "../../utils/Token.js";

// Stream event types for SSE communication
export const STREAM_EVENTS = {
  SESSION_STARTED: "session-started", 
  SESSION_EXPIRED: "session-expired",
  STREAM_ENDED: "stream-ended",
  UNAUTHORIZED: "unauthorized",
  HEARTBEAT_TIMEOUT: "heartbeat-timeout",
  INTERNAL_ERROR: "internal-error",
} as const;

// Emit logs to SSE stream and handle log ingestion logic
export const ingestLogsService = async (
  logs: LogInput[],
  serviceId: string,
) => {
  // logger.info(`Received ${logs.length} logs for ingestion`);

  // emit realtime event
  streamEmitter.emit(`logs:${serviceId}`, logs);

  return;
};

// Validate service and create stream token for session ingestion
export const ingestSessionService = async (
  serviceId: string,
  userId: string,
) => {
  const service = await Service.exists({ _id: serviceId, userId });
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  const token = createStreamToken({ serviceId, userId, type: "stream" });

  return token;
};
