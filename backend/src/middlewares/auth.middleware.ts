import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/Token.js";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Authorization token missing"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
  }
};
