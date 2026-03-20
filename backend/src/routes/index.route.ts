import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
import serviceRoutes from "../modules/service/service.route.js";
import endpointRoutes from "../modules/endpoint/endpoint.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/service", serviceRoutes);
router.use("/endpoint", endpointRoutes);

export default router;
