import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import {
  validateBody,
  validateQuery,
} from "../../middlewares/validateRequest.middleware.js";
import {
  googleCallback,
  googleLogin,
  login,
  logout,
  me,
  register,
} from "./auth.controller.js";
import {
  googleOAuthSchema,
  loginSchema,
  registerSchema,
} from "./auth.validation.js";

const router = Router();

// Register and login routes
router.post(
  "/register",
  authRateLimiter,
  validateBody(registerSchema),
  register,
);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);

router.post("/logout", logout);
router.get("/me", authMiddleware, me);

// Google OAuth routes
router.get("/google", googleLogin);
router.get(
  "/google/callback",
  validateQuery(googleOAuthSchema),
  googleCallback,
);

export default router;
