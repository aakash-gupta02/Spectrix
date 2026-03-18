import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/ApiResponse.js";
import CatchAsync from "../../utils/CatchAsync.js";
import { loginService, meService, registerService } from "./auth.service.js";
import { setCookie } from "../../utils/SetCookie.js";

export const register = CatchAsync(async (req: Request, res: Response) => {
  const { token, user } = await registerService(req.body);

  setCookie(res, "token", token);

  sendResponse(res, StatusCodes.CREATED, "User registered successfully", { token, user });
});

export const login = CatchAsync(async (req: Request, res: Response) => {
  const { token, user } = await loginService(req.body);

  setCookie(res, "token", token);

  sendResponse(res, StatusCodes.OK, "Login successful", { token, user });
});

export const me = CatchAsync(async (req: Request, res: Response) => {
  const user = await meService(req.user.userId);
  sendResponse(res, StatusCodes.OK, "User profile fetched", { user });
});
