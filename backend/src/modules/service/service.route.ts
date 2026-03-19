import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validateRequest.middleware.js";
import { createService, deleteService, getServiceById, getServices, updateService } from "./service.controller.js";
import { createServiceSchema, serviceIdParamsSchema, serviceListQuerySchema, updateServiceSchema } from "./service.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateBody(createServiceSchema), createService);
router.get("/", validateQuery(serviceListQuerySchema), getServices);
router.get("/:id", validateParams(serviceIdParamsSchema), getServiceById);
router.patch("/:id", validateParams(serviceIdParamsSchema), validateBody(updateServiceSchema), updateService);
router.delete("/:id", validateParams(serviceIdParamsSchema), deleteService);

export default router;