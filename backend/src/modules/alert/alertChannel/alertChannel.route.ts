import { Router } from "express";
import { createAlertChannel } from "./alertChannel.controller.js";
import { createAlertChannelSchema } from "./alertChannel.validation.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { validateBody } from "../../../middlewares/validateRequest.middleware.js";

const router = Router();
router.use(authMiddleware);

// Create
router.post("/", validateBody(createAlertChannelSchema), createAlertChannel);

export default router;