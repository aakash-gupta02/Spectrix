import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  validateParams,
  validateQuery,
} from "../../middlewares/validateRequest.middleware.js";
import {
  getEndpointTimeseries,
  getEndpointTopLevel,
  overview,
} from "./metrics.controller.js";
import {
  endpointIdParamsSchema,
  getEndpointTopLevelQuerySchema,
  getEndpointTimeseriesQuerySchema,
  serviceIdQuerySchema,
} from "./metrics.validation.js";

const router = Router();

// router.use(authMiddleware);

router.get(
  "/endpoint/:id/top-level",
  validateParams(endpointIdParamsSchema),
  validateQuery(getEndpointTopLevelQuerySchema),
  getEndpointTopLevel,
);

router.get(
  "/endpoint/:id/timeseries",
  validateParams(endpointIdParamsSchema),
  validateQuery(getEndpointTimeseriesQuerySchema),
  getEndpointTimeseries,
);

router.get("/overview", validateQuery(serviceIdQuerySchema), overview);

export default router;
