import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getLogs } from "./log.controller.js";
import { validateQuery } from "../../middlewares/validateRequest.middleware.js";
import { getLogsQuerySchema } from "./log.validation.js";
const router = Router();

router.use(authMiddleware);

router.get("/", validateQuery(getLogsQuerySchema), getLogs);

export default router;