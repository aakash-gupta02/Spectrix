import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
  // General
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  
  // Authentication
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Frontend 
  CLIENT: z.string().min(1, "CLIENT is required"),

  // Webhooks
  DC_WEBHOOK_URL: z.string().min(1, "DC_WEBHOOK_URL is required"),
  SLACK_WEBHOOK_URL: z.string().min(1, "SLACK_WEBHOOK_URL is required"),

  // Encryption
  CURRENT_KEY_VERSION: z.string().min(1, "CURRENT_KEY_VERSION is required"),
  KEY_v1: z.string().min(1, "KEY_v1 is required"),

  // Workers
  RUN_WORKERS: z.enum(["true", "false"]).default("false"),
  RUN_CRONS: z.enum(["true", "false"]).default("false"),

  // ClearUp Days - number of days after which logs should be cleared up
  CLEANUP_DAYS: z.coerce.number().default(7),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
}

export const env = parsed.data;

const staticOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://spectrix.d3labs.tech",
];

export const allowedOrigins = [
  env.CLIENT,
  ...staticOrigins,
];