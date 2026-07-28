import { createClient } from "redis";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const redis = createClient({ url: env.REDIS_URL });

export const connectRedis = async () => {
  try {
    await redis.connect();
    logger.info("Redis connected successfully");
  } catch (error) {
    logger.error("Redis connection error:", error);
  }
};

export default redis;