import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validateRequest.middleware.js";
import { createEndpoint } from "./endpoint.controller.js";
import { createEndpointSchema } from "./endpoint.validation.js";

const router = Router();
router.use(authMiddleware);

router.post("/", validateBody(createEndpointSchema), createEndpoint);

export default router;