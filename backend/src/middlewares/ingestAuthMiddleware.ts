import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

import { Stream } from "../modules/stream/stream.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { getKey } from "../utils/encryption/keyManager.js";

declare global {
  namespace Express {
    interface Request {
      stream?: {
        streamId: any;
        serviceId: any;
        userId: any;
      };
    }
  }
}

export function extractKeyVersion(
  apiKey: string,
): string {
  const parts = apiKey.split("_");

  if (parts.length !== 4) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid API key format");
  }

  const version = parts[1];

  if (!/^v\d+$/.test(version)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid API key version");
  }

  return version;
}

export const authenticateIngestKey = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Missing API key",
      ),
    );
  }

  const apiKey = authHeader.split(" ")[1];

  const version = extractKeyVersion(apiKey);

  const secret = getKey(version);

  const keyHash = crypto
    .createHmac("sha256", secret)
    .update(apiKey)
    .digest("hex");

  const stream = await Stream.findOne({
    keyHash,
    isActive: true,
  }).select("_id serviceId userId");

  if (!stream) {
    return next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Invalid API key",
      ),
    );
  }

  req.stream = {
    streamId: stream._id,
    serviceId: stream.serviceId,
    userId: stream.userId,
  };

  next();
};