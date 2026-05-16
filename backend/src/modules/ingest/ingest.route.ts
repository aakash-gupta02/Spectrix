import { Router } from "express";
import {
  ingestLogsController,
  ingestSessionController,
  streamLogsController,
} from "./ingest.controller.js";
import {
  validateBody,
  validateParams,
} from "../../middlewares/validateRequest.middleware.js";
import {
  ingestLogsParamsSchema,
  ingestLogsSchema,
  ingestSessionSchema,
} from "./ingest.validation.js";
import { authenticateIngestKey, streamMiddleware } from "../../middlewares/ingestAuthMiddleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Ingest logs endpoint
router.post(
  "/logs",
  authenticateIngestKey,
  validateBody(ingestLogsSchema),
  ingestLogsController,
);
// Ingest session endpoint
router.post(
  "/session",
  authMiddleware,
  validateBody(ingestSessionSchema),
  ingestSessionController,
);

// Stream logs endpoint
router.get(
  "/sse/:id",
  authMiddleware,
  streamMiddleware,
  validateParams(ingestLogsParamsSchema),
  streamLogsController,
);
export default router;
