import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "./logger.js";

export const connectDB = async (): Promise<void> => {

  let connected = false;
  while (!connected) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      connected = true;
      logger.info("MongoDB connected");
    } catch (err) {
      logger.error("MongoDB connection error:", err);
      logger.info("Retrying in 5 seconds...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

};
