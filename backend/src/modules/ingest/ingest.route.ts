import { Router } from "express";
import {
  ingestLogsController,
  streamLogsController,
} from "./ingest.controller.js";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validateRequest.middleware.js";
import {
  ingestLogsParamsSchema,
  ingestLogsSchema,
} from "./ingest.validation.js";
import { authenticateIngestKey } from "../../middlewares/ingestAuthMiddleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/logs",
  authenticateIngestKey,
  validateBody(ingestLogsSchema),
  ingestLogsController,
);

router.get(
  "/sse",
  authMiddleware,
  validateParams(ingestLogsParamsSchema),
  streamLogsController,
);
export default router;
