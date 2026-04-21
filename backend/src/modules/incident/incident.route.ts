import { Router } from "express";
import { getIncidentById, getIncidents } from "./incident.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateParams, validateQuery } from "../../middlewares/validateRequest.middleware.js";
import { getIncidentsQuerySchema, incidentIdParamsSchema } from "./incident.validation.js";

const router = Router();
// router.use(authMiddleware);


router.get("/", validateQuery(getIncidentsQuerySchema), getIncidents);
router.get("/:id", validateParams(incidentIdParamsSchema), getIncidentById);

export default router;