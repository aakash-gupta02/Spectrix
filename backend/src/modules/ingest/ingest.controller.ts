import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import {
  ingestLogsService,
  ingestSessionService,
  STREAM_EVENT_MESSAGES,
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
  const expiryTime = Date.now() + expiresIn;

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

  // Session started event with expiry info
  res.write(`event: ${STREAM_EVENTS.SESSION_STARTED}\n`);
  res.write(
    `data: ${JSON.stringify({
      message: STREAM_EVENT_MESSAGES[STREAM_EVENTS.SESSION_STARTED],
      expiresAt: expiryTime,
      expiresIn: expiresIn,
      timestamp: new Date().toISOString(),
    })}\n\n`,
  );

  let closed = false;
  let lastHeartbeat = Date.now();

  // listener for logs
  const listener = (logs: unknown) => {
    if (closed) return;
    try {
      res.write(`event: ${STREAM_EVENTS.LOG_BATCH}\n`);
      res.write(
        `data: ${JSON.stringify({
          batch: logs,
          timestamp: new Date().toISOString(),
          count: Array.isArray(logs) ? logs.length : 1,
        })}\n\n`,
      );
    } catch (error) {
      logger.error("Error writing to SSE stream:", error);
      cleanup();
    }
  };

  // subscribe
  streamEmitter.on(eventName, listener);

  // Enhanced heartbeat with status
  const heartbeat = setInterval(() => {
    if (closed) return;

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    res.write(`event: ${STREAM_EVENTS.HEARTBEAT}\n`);
    res.write(
      `data: ${JSON.stringify({
        timestamp: now,
        timeUntilExpiry: timeUntilExpiry,
        isHealthy: true,
      })}\n\n`,
    );

    lastHeartbeat = now;
  }, 15000); // Send heartbeat every 15 seconds

  // Add expiry warnings (in streamLogsController, before the auto-expire timeout)
  const expiryWarnings = [
    { time: 60000, message: "Stream will expire in 1 minute" },
    { time: 30000, message: "Stream will expire in 30 seconds" },
    { time: 10000, message: "Stream will expire in 10 seconds" },
  ];

  expiryWarnings.forEach(({ time, message }) => {
    const delay = expiresIn - time;
    if (delay > 0) {
      setTimeout(() => {
        if (!closed) {
          res.write(`event: ${STREAM_EVENTS.EXPIRY_WARNING}\n`);
          res.write(
            `data: ${JSON.stringify({ message, expiresIn: time })}\n\n`,
          );
        }
      }, delay);
    }
  });

  // auto-expire stream
  const timeout = setTimeout(() => {
    if (!closed) {
      logger.info("Stream session expired");
      res.write(`event: ${STREAM_EVENTS.SESSION_EXPIRED}\n`);
      res.write(
        `data: ${JSON.stringify({
          message: STREAM_EVENT_MESSAGES[STREAM_EVENTS.SESSION_EXPIRED],
          expiredAt: new Date().toISOString(),
          duration: expiresIn,
        })}\n\n`,
      );
      cleanup();
    }
  }, expiresIn);

  // cleanup function
  const cleanup = () => {
    if (closed) return;
    closed = true;

    clearTimeout(timeout);
    clearInterval(heartbeat);
    // warningTimeouts.forEach(timeout => clearTimeout(timeout!));
    streamEmitter.off(eventName, listener);

    // Send stream ended event
    try {
      res.write(`event: ${STREAM_EVENTS.STREAM_ENDED}\n`);
      res.write(
        `data: ${JSON.stringify({
          message: STREAM_EVENT_MESSAGES[STREAM_EVENTS.STREAM_ENDED],
          endedAt: new Date().toISOString(),
        })}\n\n`,
      );
    } catch (error) {
      // Ignore write errors during cleanup
    }

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
