import { Router } from "express";
import {
  getIncidentById,
  getIncidents,
  updateIncidentById,
} from "./incident.controller.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../core/middlewares/validateRequest.middleware.js";
import {
  getIncidentsQuerySchema,
  incidentIdParamsSchema,
  updateIncidentSchema,
} from "./incident.validation.js";

const router = Router();

router.get("/", validateQuery(getIncidentsQuerySchema), getIncidents);
router.get("/:id", validateParams(incidentIdParamsSchema), getIncidentById);
router.patch(
  "/:id",
  validateBody(updateIncidentSchema),
  validateParams(incidentIdParamsSchema),
  updateIncidentById,
);

export default router;
