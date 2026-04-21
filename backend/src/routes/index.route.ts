import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
import serviceRoutes from "../modules/service/service.route.js";
import endpointRoutes from "../modules/endpoint/endpoint.route.js";
import logRoutes from "../modules/log/log.route.js";
import metricsRoutes from "../modules/metrics/metrics.route.js";
import incidentRoutes from "../modules/incident/incident.route.js";
import alertChannelRoutes from "../modules/alert/alertChannel/alertChannel.route.js";
import {
  authMiddleware,
  blockDemoWrites,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);

router.use(authMiddleware); // Apply authentication middleware to all routes below
router.use(blockDemoWrites); // Block write operations in demo mode

router.use("/service", serviceRoutes);
router.use("/endpoint", endpointRoutes);
router.use("/log", logRoutes);
router.use("/metrics", metricsRoutes);
router.use("/incident", incidentRoutes);
router.use("/alert-channel", alertChannelRoutes);

export default router;
