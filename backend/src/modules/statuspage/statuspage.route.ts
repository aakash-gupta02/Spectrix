import { Router } from "express";

import { getStatuspage } from "./statuspage.controller.js";

const router = Router();

router.get("/", getStatuspage);

export default router;
