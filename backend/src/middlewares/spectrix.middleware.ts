//spectrix.middleware.ts
// if you are user & looking a middleware this middleware is not for you, since here i am doing a service call instead of api call to send logs to spectrix, so if you want to use spectrix as a user you can directly call the spectrix client in your code and send logs without worrying about the middleware part. check middleware implementation here https://spectrix.d3labs.tech/docs/realtime-streaming

import { Request, Response, NextFunction } from "express";
import { ingestLogsService } from "../modules/ingest/ingest.service.js";
import { IngestLogsInput } from "../modules/ingest/ingest.validation.js";

interface SpectrixOptions {
  serviceId: string;
  source?: string;
  interval?: number;
  maxBufferSize?: number;
}

interface LogEntry {
  timestamp?: string;
  source?: string;
  level: string;
  message: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
}

class SpectrixClient {
  public serviceId: string;
  public source: string;
  public interval: number;
  public maxBufferSize: number;
  private buffer: LogEntry[];
  private timer: NodeJS.Timeout | null;

  constructor(options: SpectrixOptions) {
    this.serviceId = options.serviceId;
    this.source = options.source || "node-app";
    this.interval = options.interval || 2000;
    this.maxBufferSize = options.maxBufferSize || 50;
    this.buffer = [];
    this.timer = null;
    this.start();
  }

  start(): void {
    this.timer = setInterval(() => {
      this.flush();
    }, this.interval);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.flush();
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const logs = [...this.buffer];
    this.buffer = [];

    try {
      await ingestLogsService(logs as IngestLogsInput["logs"], this.serviceId);
    } catch (error: any) {
      console.error("Spectrix ingestion failed:", error.message);
      // restore failed logs
      this.buffer.unshift(...logs);
    }
  }

  push(log: LogEntry): void {
    this.buffer.push({
      timestamp: new Date().toISOString(),
      source: this.source,
      ...log,
    });

    // instant flush if large
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  info(message: string, metadata: Record<string, any> = {}): void {
    this.push({ level: "info", message, metadata });
  }

  warn(message: string, metadata: Record<string, any> = {}): void {
    this.push({ level: "warn", message, metadata });
  }

  error(message: string, metadata: Record<string, any> = {}): void {
    this.push({ level: "error", message, metadata });
  }

  debug(message: string, metadata: Record<string, any> = {}): void {
    this.push({ level: "debug", message, metadata });
  }
}

function spectrix(options: SpectrixOptions) {
  const client = new SpectrixClient(options);

  // This is the actual Express middleware function that wraps requests
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now(); // Track when the request starts

    // Wait for the request to finish before logging it
    res.on("finish", () => {
      const duration = Date.now() - start;
      let level = "info";

      // Determine log level based on HTTP status code
      if (res.statusCode >= 500) {
        level = "error";
      } else if (res.statusCode >= 400) {
        level = "warn";
      }

      // Push the request data as a log to the client buffer
      client.push({
        level,
        message: `${req.method} ${req.originalUrl}`,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        metadata: {
          duration,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    });

    next(); // Proceed to the next middleware or route handler
  };

  // manual logger access
  middleware.client = client;
  return middleware;
}

export default spectrix;
