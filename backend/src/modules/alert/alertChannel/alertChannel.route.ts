import { Router } from "express";
import { createAlertChannel, deleteAlertChannel, getAlertChannels } from "./alertChannel.controller.js";
import { alertChannelIdParamSchema, createAlertChannelSchema } from "./alertChannel.validation.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { validateBody, validateParams } from "../../../middlewares/validateRequest.middleware.js";

const router = Router();
// router.use(authMiddleware);

// Create
router.post("/", validateBody(createAlertChannelSchema), createAlertChannel);

// Update & Delete
router.delete("/:id", validateParams(alertChannelIdParamSchema), deleteAlertChannel);

// Get
router.get('/', getAlertChannels);

export default router;