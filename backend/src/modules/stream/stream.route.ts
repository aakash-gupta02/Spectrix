import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateBody, validateParams } from "../../middlewares/validateRequest.middleware.js";
import { createStream, deleteStream, getStreamById, getStreams, updateStream } from "./stream.controller.js";
import { createStreamSchema, deleteStreamSchema, getStreamSchema, updateStreamSchema } from "./stream.validation.js";

const router = Router();

router.use(authMiddleware);

// Create a new stream
router.post("/", validateBody(createStreamSchema), createStream);

// Read streams
router.get("/", getStreams);
router.get("/:id", validateParams(getStreamSchema), getStreamById);

// Update stream
router.patch("/:id", validateParams(getStreamSchema), validateBody(updateStreamSchema), updateStream);

// Delete stream
router.delete("/:id", validateParams(deleteStreamSchema), deleteStream);

export default router;
