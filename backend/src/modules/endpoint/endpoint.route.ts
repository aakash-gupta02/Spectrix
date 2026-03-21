import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validateRequest.middleware.js";
import { createEndpoint, deleteEndpoint, getEndpointById, getEndpoints, updateEndpoint } from "./endpoint.controller.js";
import { createEndpointSchema, endpointIdParamsSchema, getEndpointsQuerySchema, updateEndpointSchema } from "./endpoint.validation.js";

const router = Router();
router.use(authMiddleware);

// Create
router.post("/", validateBody(createEndpointSchema), createEndpoint);

// Update
router.patch("/:id", validateParams(endpointIdParamsSchema), validateBody(updateEndpointSchema), updateEndpoint);

// Delete
router.delete("/:id", validateParams(endpointIdParamsSchema), deleteEndpoint);

// Read
router.get("/:id", validateParams(endpointIdParamsSchema), getEndpointById);
router.get("/", validateQuery(getEndpointsQuerySchema), getEndpoints);

export default router;