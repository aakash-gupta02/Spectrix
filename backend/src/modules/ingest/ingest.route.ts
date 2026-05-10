import { Router } from "express";
import { ingestLogsController, streamLogsController } from "./ingest.controller.js";
import { validateBody } from "../../middlewares/validateRequest.middleware.js";
import { ingestLogsSchema } from "./ingest.validation.js";
import { authenticateIngestKey } from "../../middlewares/ingestAuthMiddleware.js";

const router = Router();

router.post(
  "/logs",
  authenticateIngestKey,
  validateBody(ingestLogsSchema),
  ingestLogsController,
);

router.get("/sse", streamLogsController);
export default router;
