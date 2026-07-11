import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";

import { allowedOrigins, env } from "./core/config/env.js";
import { errorMiddleware } from "./core/middlewares/error.middleware.js";
import { notFoundMiddleware } from "./core/middlewares/notFound.middleware.js";
import { requestLogger } from "./core/middlewares/requestLogger.js";
import spectrix from "./core/middlewares/spectrix.middleware.js";
import sendResponse from "./shared/utils/ApiResponse.js";
import apiRoutes from "./routes/index.route.js";

// Initialize Express app
const app = express();

// Trust the first proxy (if behind a reverse proxy like Nginx or render)
app.set("trust proxy", 1);

// Middleware setup
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
// app.use(globalRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

if (env.SPECTRIX_SERVICE_ID) {
  const spectrixClient = spectrix({
    serviceId: env.SPECTRIX_SERVICE_ID,
  });

  app.use(spectrixClient);
}

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, StatusCodes.OK, "Spectrix is Watching", {
    env: env.NODE_ENV,
  });
});

// API routes
app.use("/api/v1", apiRoutes);

// Handle 404 Not Found and other errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
