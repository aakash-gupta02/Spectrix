import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import {
  googleCallbackService,
  loginService,
  meService,
  registerService,
} from "./auth.service.js";
import { clearCookie, setCookie } from "../../utils/SetCookie.js";
import { generateGoogleAuthUrl } from "../../utils/google.js";
import { logger } from "../../config/logger.js";
import { env } from "../../config/env.js";

// Register a new user
export const register = CatchAsync(async (req: Request, res: Response) => {
  const { token, user } = await registerService(req.body);

  setCookie(res, "token", token);

  sendResponse(res, StatusCodes.CREATED, "User registered successfully", {
    user,
  });
});

// Login an existing user
export const login = CatchAsync(async (req: Request, res: Response) => {
  const { token, user } = await loginService(req.body);

  setCookie(res, "token", token);

  sendResponse(res, StatusCodes.OK, "Login successful", { user });
});

// Get the profile of the currently authenticated user
export const me = CatchAsync(async (req: Request, res: Response) => {
  const user = await meService(req.user.userId);
  sendResponse(res, StatusCodes.OK, "User profile fetched", { user });
});

// Logout the user by clearing the authentication cookie
export const logout = CatchAsync(async (_req: Request, res: Response) => {
  clearCookie(res, "token");
  sendResponse(res, StatusCodes.OK, "Logout successful");
});

export const googleLogin = CatchAsync(async (req: Request, res: Response) => {
  const { state, url } = generateGoogleAuthUrl();

  setCookie(res, "oauth_state", state);

  return res.redirect(url);
});

export const googleCallback = CatchAsync(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    const { token, user } = await googleCallbackService(
      code as string,
      state as string,
      storedState,
    );
    clearCookie(res, "oauth_state");
    setCookie(res, "token", token);

    res.redirect(`${env.CLIENT}/dashboard`);
  },
);
