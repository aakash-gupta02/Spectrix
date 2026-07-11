import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../shared/utils/ApiResponse.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import {
  googleCallbackService,
  loginService,
  logoutService,
  meService,
  refreshTokensService,
  registerService,
} from "./auth.service.js";
import { clearCookie, setCookie } from "../../shared/utils/SetCookie.js";
import { generateGoogleAuthUrl } from "../../shared/utils/google.js";
import { logger } from "../../core/config/logger.js";
import { env } from "../../core/config/env.js";
import { GoogleOAuthInput } from "./auth.validation.js";

const fifteenMinutes = 15 * 60 * 1000;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

// Register a new user
export const register = CatchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await registerService(req.body);

  setCookie(res, "accessToken", accessToken, { maxAge: fifteenMinutes });
  setCookie(res, "refreshToken", refreshToken, { maxAge: sevenDays });

  sendResponse(res, StatusCodes.CREATED, "User registered successfully", {
    user,
  });
});

// Login an existing user
export const login = CatchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await loginService(req.body);

  setCookie(res, "accessToken", accessToken, { maxAge: fifteenMinutes });
  setCookie(res, "refreshToken", refreshToken, { maxAge: sevenDays });

  sendResponse(res, StatusCodes.OK, "Login successful", { user });
});

// Get the profile of the currently authenticated user
export const me = CatchAsync(async (req: Request, res: Response) => {
  const user = await meService(req.user.userId);
  sendResponse(res, StatusCodes.OK, "User profile fetched", { user });
});

// Logout the user by clearing the authentication cookie
export const logout = CatchAsync(async (req: Request, res: Response) => {
  await logoutService(req.user.userId);

  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");
  sendResponse(res, StatusCodes.OK, "Logout successful");
});

// Initiate Google OAuth login flow
export const googleLogin = CatchAsync(async (req: Request, res: Response) => {
  const { state, url } = generateGoogleAuthUrl();

  setCookie(res, "oauth_state", state);

  return res.redirect(url);
});

// Handle Google OAuth callback
export const googleCallback = CatchAsync(
  async (req: Request, res: Response) => {
    const { code, state } = req.query as unknown as GoogleOAuthInput;
    const storedState = req.cookies.oauth_state;

    const { accessToken, refreshToken, redirectPath } =
      await googleCallbackService(code, state, storedState);

    clearCookie(res, "oauth_state");
    setCookie(res, "accessToken", accessToken, { maxAge: fifteenMinutes });
    setCookie(res, "refreshToken", refreshToken, { maxAge: sevenDays });

    res.redirect(`${env.CLIENT}${redirectPath}`);
  },
);

export const refreshToken = CatchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.refreshToken;
  const userId = req.user.userId;

  const { accessToken } = await refreshTokensService(userId, refreshToken);
  setCookie(res, "accessToken", accessToken, { maxAge: fifteenMinutes });

  sendResponse(res, StatusCodes.OK, "Access token refreshed", {
    accessToken,
  });
});
