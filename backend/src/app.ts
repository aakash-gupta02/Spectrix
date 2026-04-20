import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";

import { allowedOrigins, env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import apiRoutes from "./routes/index.route.js";
import sendResponse from "./utils/ApiResponse.js";

// Initialize Express app
const app = express();

// Trust the first proxy (if behind a reverse proxy like Nginx or render)
app.set("trust proxy", 1);

// Middleware setup
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(globalRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, StatusCodes.OK, "Spectrix is Watching", { env: env.NODE_ENV });
});

// API routes
app.use("/api/v1", apiRoutes);

// Handle 404 Not Found and other errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
