import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../shared/utils/ApiResponse.js";
import CatchAsync from "../../shared/utils/CatchAsync.js";
import {
  githubOAuthService,
  githubSetupService,
  googleCallbackService,
  loginService,
  logoutService,
  meService,
  refreshTokensService,
  registerService,
  updateAiCredentialsService,
} from "./auth.service.js";
import { clearCookie, setCookie } from "../../shared/utils/SetCookie.js";
import { generateGoogleAuthUrl } from "../../shared/utils/google.js";
import { logger } from "../../core/config/logger.js";
import { env } from "../../core/config/env.js";
import {
  AiCredentialsInput,
  GithubOAuthInput,
  GoogleOAuthInput,
} from "./auth.validation.js";
import {
  generateGitHubAuthUrl,
  generateGitHubInstallationUrl,
} from "../../shared/utils/github.js";

import jwt from "jsonwebtoken";

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

// Update the user's AI credentials
export const updateAiCredentials = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const input: AiCredentialsInput = req.body;

    const updatedUser = await updateAiCredentialsService(userId, input);

    sendResponse(res, StatusCodes.OK, "AI credentials updated", {
      user: updatedUser,
    });
  },
);

// Initiate GitHub OAuth login flow
export const githubLogin = CatchAsync(async (req: Request, res: Response) => {
  const url = generateGitHubInstallationUrl(req.user.userId);

  return res.redirect(url);
});

// Handle Github Setup
export const githubSetup = CatchAsync(async (req: Request, res: Response) => {
  const { installation_id, setup_action, state } =
    req.query as unknown as GithubOAuthInput;

  // 1. Handle cancelled installations
  if (setup_action === "cancel" || !installation_id) {
    return res.redirect(`${env.CLIENT}/settings/ai-diagnosis?github=cancelled`);
  }

  // 2. Verify the state to find out WHO is installing this
  let userId: string;
  try {
    const decoded = jwt.verify(state as string, env.GITHUB_STATE_SECRET) as {
      userId: string;
    };
    userId = decoded.userId;
  } catch (err) {
    return res.redirect(
      `${env.CLIENT}/settings/ai-diagnosis?github=error&reason=invalid_state`,
    );
  }

  await githubSetupService({ installation_id, setup_action, state }, userId);

  const authRedirectURl = generateGitHubAuthUrl(userId);

  return res.redirect(authRedirectURl);
});

// Handle Github OAuth callback
export const githubCallback = CatchAsync(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    // 1. Verify State
    let userId: string;
    try {
      const decoded = jwt.verify(state as string, env.GITHUB_STATE_SECRET) as {
        userId: string;
      };
      userId = decoded.userId;
    } catch (err) {
      return res.redirect(
        `${env.CLIENT}/settings/ai-diagnosis?github=error&reason=invalid_state`,
      );
    }

    await githubOAuthService(code as string, userId);

    return res.redirect(`${env.CLIENT}/settings/ai-diagnosis?github=success`);
  },
);
