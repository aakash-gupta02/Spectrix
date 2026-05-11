import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { ingestLogsService, ingestSessionService } from "./ingest.service.js";
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
    const serviceId = req.stream?.serviceId;

    await ingestLogsService(logs, serviceId);

    sendResponse(res, StatusCodes.OK, "Logs ingested successfully");
  },
);

// Stream Logs Controller - SSE endpoint for real-time log streaming
export const streamLogsController = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params as unknown as ObjectIdParams;

  // Verify service exists and belongs to user
  const service = await Service.exists({ _id: id, userId });
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  const eventName = `logs:${id}`;

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Flush headers for immediate browser processing
  res.flushHeaders?.();

  // listener
  const listener = (logs: unknown) => {
    try {
      res.write(`data: ${JSON.stringify(logs)}\n\n`);
      // logger.info(
      //   `Sent ${Array.isArray(logs) ? logs.length : 1} logs to client`,
      // );
    } catch (error) {
      logger.error("Error writing to SSE stream:", error);
    }
  };

  // subscribe
  streamEmitter.on(eventName, listener);

  // Handle client disconnect
  res.on("error", (error) => {
    logger.error("SSE stream error:", error);
    streamEmitter.off(eventName, listener);
    res.end();
  });

  req.on("close", () => {
    logger.info("Client disconnected from log stream");
    streamEmitter.off(eventName, listener);
    res.end();
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
