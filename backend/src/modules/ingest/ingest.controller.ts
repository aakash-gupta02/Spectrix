import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { ingestLogsService } from "./ingest.service.js";
import { IngestLogsInput } from "./ingest.validation.js";
import { streamEmitter } from "./emitter.js";
import { logger } from "../../config/logger.js";

export const ingestLogsController = CatchAsync(
  async (req: Request, res: Response) => {
    const { logs }: IngestLogsInput = req.body;

    await ingestLogsService(logs);

    sendResponse(res, StatusCodes.OK, "Logs ingested successfully");
  },
);

export const streamLogsController = (req: Request, res: Response) => {
  logger.info("Client connected to log stream");

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  logger.info("SSE headers set for log streaming");

  // Flush headers for immediate browser processing
  res.flushHeaders?.();

  // listener
  const listener = (logs: unknown) => {
    try {
      res.write(`data: ${JSON.stringify(logs)}\n\n`);
      logger.info(`Sent ${Array.isArray(logs) ? logs.length : 1} logs to client`);
    } catch (error) {
      logger.error("Error writing to SSE stream:", error);
    }
  };

  // subscribe
  streamEmitter.on("logs", listener);

  // Handle client disconnect
  res.on("error", (error) => {
    logger.error("SSE stream error:", error);
    streamEmitter.off("logs", listener);
    res.end();
  });

  req.on("close", () => {
    logger.info("Client disconnected from log stream");
    streamEmitter.off("logs", listener);
    res.end();
  });
};
