import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { logger } from "../config/logger.js";
import ApiError from "../utils/ApiError.js";

type MongoError = Error & { code?: number; keyValue?: Record<string, unknown> };
type MongooseValidationError = Error & {
  name?: string;
  errors?: Record<string, { path?: string; message?: string }>;
};
type MongooseCastError = Error & { name?: string; path?: string; message?: string };

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const stack = error instanceof Error ? error.stack : undefined;

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errors: unknown[] = [];

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if ((error as MongooseValidationError)?.name === "ValidationError") {
    const validationError = error as MongooseValidationError;

    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation failed";
    errors = Object.values(validationError.errors ?? {}).map((fieldError) => ({
      path: fieldError.path,
      message: fieldError.message,
    }));
  } else if ((error as MongooseCastError)?.name === "CastError") {
    const castError = error as MongooseCastError;

    statusCode = StatusCodes.BAD_REQUEST;
    message = "Invalid input value";
    errors = [
      {
        path: castError.path,
        message: castError.message,
      },
    ];
  } else {
    const mongoError = error as MongoError;
    if (mongoError.code === 11000) {
      statusCode = StatusCodes.CONFLICT;
      message = "Duplicate value detected";
      errors = Object.keys(mongoError.keyValue ?? {}).map((key) => ({
        path: key,
        message: `${key} already exists`,
      }));
    }
  }

  logger.error(`errorMessage: ${errorMessage}, stack: ${stack}`, { statusCode, error });

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
