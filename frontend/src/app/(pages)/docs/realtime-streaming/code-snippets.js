export const typescriptCode = `import { Request, Response, NextFunction } from "express";

const API_BASE_URL = "http://localhost:4000/api/v1";

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
            const response = await fetch(\`\${API_BASE_URL}/ingest/logs\`, {
                method: "POST",
                headers: {
                    Authorization: \`Bearer \${this.apiKey}\`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    logs,
                }),
            });

            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}\`);
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

    const middleware = (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - start;
            let level = "info";

            if (res.statusCode >= 500) {
                level = "error";
            } else if (res.statusCode >= 400) {
                level = "warn";
            }

            client.push({
                level,
                message: \`\${req.method} \${req.originalUrl}\`,
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

        next();
    };

    // manual logger access
    middleware.client = client;
    return middleware;
}

export default spectrix;`;

export const javascriptCode = `const API_BASE_URL = "http://localhost:4000/api/v1";

class SpectrixClient {
    constructor(options = {}) {
        this.apiKey = options.apiKey;
        this.source = options.source || "node-app";
        this.interval = options.interval || 2000;
        this.maxBufferSize = options.maxBufferSize || 50;
        this.buffer = [];
        this.timer = null;
        this.start();
    }

    start() {
        this.timer = setInterval(() => {
            this.flush();
        }, this.interval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.flush();
    }

    async flush() {
        if (this.buffer.length === 0) {
            return;
        }

        const logs = [...this.buffer];
        this.buffer = [];

        try {
            const response = await fetch(\`\${API_BASE_URL}/ingest/logs\`, {
                method: "POST",
                headers: {
                    Authorization: \`Bearer \${this.apiKey}\`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    logs,
                }),
            });

            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}\`);
            }
        } catch (error) {
            console.error("Spectrix ingestion failed:", error.message);
            // restore failed logs
            this.buffer.unshift(...logs);
        }
    }

    push(log) {
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

    info(message, metadata = {}) {
        this.push({ level: "info", message, metadata });
    }

    warn(message, metadata = {}) {
        this.push({ level: "warn", message, metadata });
    }

    error(message, metadata = {}) {
        this.push({ level: "error", message, metadata });
    }

    debug(message, metadata = {}) {
        this.push({ level: "debug", message, metadata });
    }
}

function spectrix(options = {}) {
    const client = new SpectrixClient(options);

    const middleware = (req, res, next) => {
        const start = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - start;
            let level = "info";

            if (res.statusCode >= 500) {
                level = "error";
            } else if (res.statusCode >= 400) {
                level = "warn";
            }

            client.push({
                level,
                message: \`\${req.method} \${req.originalUrl}\`,
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

        next();
    };

    // manual logger access
    middleware.client = client;
    return middleware;
}

module.exports = spectrix;`;

export const expressMiddlewareCode = `const express = require("express");
const spectrix = require("./spectrix");

const app = express();

app.use(
  spectrix({
    apiKey: process.env.SPECTRIX_API_KEY,
    source: "auth-service",
  })
);`;

export const jsonLogCode = `{
  "level": "info",
  "message": "GET /api/users",
  "endpoint": "/api/users",
  "method": "GET",
  "statusCode": 200,
  "timestamp": "2026-05-14T10:30:00.000Z"
}`;

export const sourceConfigCode = `spectrix({
  apiKey: process.env.SPECTRIX_API_KEY,
  source: "payment-service",
});`;