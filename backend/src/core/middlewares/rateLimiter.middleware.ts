import rateLimit from "express-rate-limit";

type RateLimiterOptions = {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
};

const createRateLimiter = ({
  windowMs,
  max,
  message = "Too many requests, please try again later.",
  skipSuccessfulRequests = false,
}: RateLimiterOptions) => {
  return rateLimit({
    windowMs,
    max,

    message: {
      success: false,
      message,
    },

    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests,
  });
};

// Global API limiter
// Example: 100 requests per 15 minutes
export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: "Too many requests from this IP.",
});

// Auth limiter
// Example: 20 failed attempts per 15 minutes
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,

  max: 20,

  message: "Too many login attempts. Please try again later.",

  skipSuccessfulRequests: true,
});

// Ingest limiter
// Example: 1000 requests per minute
export const ingestRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,

  max: 1000,

  message: "Ingestion rate limit exceeded.",
});
