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
  LOG_BATCH: "log-batch",
  HEARTBEAT: "heartbeat",
  EXPIRY_WARNING: "expiry-warning",

} as const;

export const STREAM_EVENT_MESSAGES = {
  [STREAM_EVENTS.SESSION_STARTED]: "Your stream session has started.",
  [STREAM_EVENTS.SESSION_EXPIRED]: "Your stream session has expired.",
  [STREAM_EVENTS.STREAM_ENDED]: "Live stream ended.",
  [STREAM_EVENTS.UNAUTHORIZED]: "Unauthorized stream access.",
  [STREAM_EVENTS.HEARTBEAT_TIMEOUT]: "Connection timeout occurred.",
  [STREAM_EVENTS.INTERNAL_ERROR]: "Internal stream error occurred.",
  [STREAM_EVENTS.EXPIRY_WARNING]: "Stream expiring soon",
} as const;

export const STREAM_EVENT_STYLES = {
  [STREAM_EVENTS.SESSION_STARTED]: "success",
  [STREAM_EVENTS.SESSION_EXPIRED]: "error",
  [STREAM_EVENTS.EXPIRY_WARNING]: "warning",
  [STREAM_EVENTS.HEARTBEAT]: "info",
  [STREAM_EVENTS.STREAM_ENDED]: "info",
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
