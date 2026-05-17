import { Router } from "express";

// Routes
import authRoutes from "../modules/auth/auth.route.js";
import serviceRoutes from "../modules/service/service.route.js";
import endpointRoutes from "../modules/endpoint/endpoint.route.js";
import logRoutes from "../modules/log/log.route.js";
import metricsRoutes from "../modules/metrics/metrics.route.js";
import incidentRoutes from "../modules/incident/incident.route.js";
import alertChannelRoutes from "../modules/alert/alertChannel/alertChannel.route.js";
import streamRoutes from "../modules/stream/stream.route.js";
import ingestRoutes from "../modules/ingest/ingest.route.js";

// Middleware
import {
  authMiddleware,
  blockDemoWrites,
} from "../middlewares/auth.middleware.js";

import {
  authRateLimiter,
  globalRateLimiter,
  ingestRateLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Auth APIs
router.use("/auth", authRateLimiter, authRoutes);

// Log ingestion APIs
router.use("/ingest", ingestRateLimiter, ingestRoutes);

// Require authenticated user
router.use(authMiddleware);

// Block write operations in demo mode
router.use(blockDemoWrites);

router.use("/service", globalRateLimiter, serviceRoutes);
router.use("/stream", globalRateLimiter, streamRoutes);
router.use("/endpoint", globalRateLimiter, endpointRoutes);
router.use("/log", globalRateLimiter, logRoutes);
router.use("/metrics", globalRateLimiter, metricsRoutes);
router.use("/incident", globalRateLimiter, incidentRoutes);
router.use("/alert-channel", globalRateLimiter, alertChannelRoutes);

export default router;
