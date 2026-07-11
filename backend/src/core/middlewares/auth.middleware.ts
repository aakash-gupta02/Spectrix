import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";
import { verifyAccessToken, verifyRefreshToken } from "../../shared/utils/Token.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  let token = req.cookies.accessToken || req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

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

export const blockDemoWrites = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const READ_METHODS = ["GET", "HEAD", "OPTIONS"];
  const OPEN_ROUTES = ["/auth/login", "/auth/register"];

  if (req.user?.role === "demo" && !READ_METHODS.includes(req.method)) {
    // if (OPEN_ROUTES.includes(req.path)) return next(); // allow open routes

    return next(new ApiError(403, "Demo account is read-only"));
  }
  next();
};

export const refreshTokenMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  let token = req.cookies.refreshToken || req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  if (!token) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token missing"));
    return;
  }

  try {
    const payload = verifyRefreshToken(token);

    if (payload.type !== "refresh") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token type");
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    req.refreshToken = token;

    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token"));
  }
};
