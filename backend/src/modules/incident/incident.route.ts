import { Router } from "express";
import { getIncidentById, getIncidents } from "./incident.controller.js";
import { validateParams, validateQuery } from "../../core/middlewares/validateRequest.middleware.js";
import { getIncidentsQuerySchema, incidentIdParamsSchema } from "./incident.validation.js";

const router = Router();

router.get("/", validateQuery(getIncidentsQuerySchema), getIncidents);
router.get("/:id", validateParams(incidentIdParamsSchema), getIncidentById);

export default router;