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

const app = express();

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

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, StatusCodes.OK, "Spectrix is Watching", { env: env.NODE_ENV });
});

app.use("/api/v1", apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
