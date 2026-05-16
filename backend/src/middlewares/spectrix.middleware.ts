 //spectrix.middleware.ts

import { Request, Response, NextFunction } from "express";

const API_BASE_URL = "https://spectrix-m181.onrender.com/api/v1";

interface SpectrixOptions {
    apiKey?: string;
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
    public apiKey?: string;
    public source: string;
    public interval: number;
    public maxBufferSize: number;
    private buffer: LogEntry[];
    private timer: NodeJS.Timeout | null;

    constructor(options: SpectrixOptions = {}) {
        this.apiKey = options.apiKey;
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
            const response = await fetch(`${API_BASE_URL}/ingest/logs`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    logs,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
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

function spectrix(options: SpectrixOptions = {}) {
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