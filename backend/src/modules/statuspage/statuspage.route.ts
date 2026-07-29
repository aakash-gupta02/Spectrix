import { Router } from "express";

import {
  createStatuspage,
  deleteStatuspage,
  getStatuspage,
  getStatuspageBySlug,
  trackStatuspageView,
  updateStatuspage,
} from "./statuspage.controller.js";
import {
  authMiddleware,
  blockDemoWrites,
} from "../../core/middlewares/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../core/middlewares/validateRequest.middleware.js";
import {
  createStatuspageSchema,
  statuspageSlugParamsSchema,
  updateStatuspageSchema,
} from "./statuspage.validation.js";

const router = Router();

router.get(
  "/slug/:slug",
  validateParams(statuspageSlugParamsSchema),
  getStatuspageBySlug,
);

router.post(
  "/slug/:slug/view",
  validateParams(statuspageSlugParamsSchema),
  trackStatuspageView,
);

// Require authenticated user
router.use(authMiddleware);

// Block write operations in demo mode
router.use(blockDemoWrites);

router.get("/", getStatuspage);
router.post("/", validateBody(createStatuspageSchema), createStatuspage);
router.patch("/me", validateBody(updateStatuspageSchema), updateStatuspage);
router.delete("/me", deleteStatuspage);

export default router;
