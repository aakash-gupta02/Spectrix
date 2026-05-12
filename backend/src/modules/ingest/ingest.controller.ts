import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import {
  ingestLogsService,
  ingestSessionService,
  STREAM_EVENTS,
} from "./ingest.service.js";
import { IngestLogsInput, IngestSessionInput } from "./ingest.validation.js";
import { streamEmitter } from "./emitter.js";
import { logger } from "../../config/logger.js";
import { ObjectIdParams } from "../../utils/validation.js";
import { Service } from "../service/service.model.js";
import ApiError from "../../utils/ApiError.js";
import { setCookie } from "../../utils/SetCookie.js";

// Ingest Logs Controller - Handles log ingestion requests
export const ingestLogsController = CatchAsync(
  async (req: Request, res: Response) => {
    const { logs }: IngestLogsInput = req.body;
    const serviceId = req.stream.serviceId;

    await ingestLogsService(logs, serviceId);

    sendResponse(res, StatusCodes.OK, "Logs ingested successfully");
  },
);

// Stream Logs Controller - SSE endpoint for real-time log streaming
export const streamLogsController = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as ObjectIdParams;

  const { userId, serviceId, exp } = req.streamSession!;

  // Ensure token belongs to requested service
  if (serviceId !== id) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Invalid stream session");
  }

  const expiresIn = Math.max(exp! * 1000 - Date.now(), 0);

  // Verify service exists and belongs to user
  const service = await Service.exists({
    _id: id,
    userId,
  });

  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  const eventName = `logs:${id}`;

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // immediately flush headers
  res.flushHeaders?.();

  // session started event
  res.write(`event: ${STREAM_EVENTS.SESSION_STARTED}\n`);

  res.write(`data: connected\n\n`);

  let closed = false;

  // listener
  const listener = (logs: unknown) => {
    try {
      res.write(`data: ${JSON.stringify(logs)}\n\n`);
    } catch (error) {
      logger.error("Error writing to SSE stream:", error);

      cleanup();
    }
  };

  // subscribe
  streamEmitter.on(eventName, listener);

  // heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 30000);

  // auto-expire stream
  const timeout = setTimeout(() => {
    logger.info("Stream session expired");

    res.write(`event: ${STREAM_EVENTS.SESSION_EXPIRED}\n`);

    res.write(`data: expired\n\n`);

    cleanup();
  }, expiresIn);

  // cleanup
  const cleanup = () => {
    if (closed) return;

    closed = true;

    clearTimeout(timeout);

    clearInterval(heartbeat);

    streamEmitter.off(eventName, listener);

    res.end();
  };

  // Handle stream errors
  res.on("error", (error) => {
    logger.error("SSE stream error:", error);

    cleanup();
  });

  // Handle client disconnect
  req.on("close", () => {
    logger.info("Client disconnected from log stream");

    cleanup();
  });
};

// Ingest Session Controller - Check ServiceId & creates jwt session for sse access
export const ingestSessionController = CatchAsync(
  async (req: Request, res: Response) => {
    const { serviceId }: IngestSessionInput = req.body;
    const userId = req.user.userId;

    const token = await ingestSessionService(serviceId, userId);

    setCookie(res, "streamToken", token, {
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    sendResponse(res, StatusCodes.OK, "Session ingested successfully");
  },
);
