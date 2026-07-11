import { Router } from "express";
import { getLogs, metricsOverview } from "./log.controller.js";
import { validateQuery } from "../../core/middlewares/validateRequest.middleware.js";
import { getLogsOverviewQuerySchema, getLogsQuerySchema } from "./log.validation.js";
const router = Router();

router.get("/overview", validateQuery(getLogsOverviewQuerySchema), metricsOverview);
router.get("/", validateQuery(getLogsQuerySchema), getLogs);

export default router;