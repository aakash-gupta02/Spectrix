import app from "./app.js";
import { connectRedis } from "./core/cache/cache.client.js";
import { connectDB } from "./core/config/db.js";
import { env } from "./core/config/env.js";
import { logger } from "./core/config/logger.js";
import { startCronJobsIfEnabled } from "./core/cron/cron.start.js";
import { startWorkerIfEnabled } from "./core/workers/monitor.worker.js";

const startServer = async (): Promise<void> => {
  await connectDB();
  await connectRedis();

  app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
    startWorkerIfEnabled();
    startCronJobsIfEnabled();
  });
};

startServer().catch((error: unknown) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
