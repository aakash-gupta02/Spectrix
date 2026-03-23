import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
import serviceRoutes from "../modules/service/service.route.js";
import endpointRoutes from "../modules/endpoint/endpoint.route.js";
import logRoutes from "../modules/log/log.route.js";
import metricsRoutes from "../modules/metrics/metrics.route.js";
import incidentRoutes from "../modules/incident/incident.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/service", serviceRoutes);
router.use("/endpoint", endpointRoutes);
router.use("/log", logRoutes);
router.use("/metrics", metricsRoutes);
router.use("/incident", incidentRoutes);

export default router;
