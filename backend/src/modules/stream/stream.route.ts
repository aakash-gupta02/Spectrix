import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validateRequest.middleware.js";
import { createStream } from "./stream.controller.js";
import { createStreamSchema } from "./stream.validation.js";

const router = Router();

router.use(authMiddleware);

// Create a new stream
router.post("/", validateBody(createStreamSchema), createStream);

export default router;
