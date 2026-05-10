import z from "zod";

export const logSchema = z
  .object({
    level: z.enum(["info", "warn", "error", "debug"]),

    message: z.string().trim().min(1).max(5000),

    timestamp: z.string().datetime().optional(),

    metadata: z.record(z.string(), z.unknown()).optional(),

    source: z.string().trim().max(100).optional(),

    endpoint: z.string().trim().max(500).optional(),

    method: z.string().trim().max(10).optional(),

    statusCode: z.number().int().min(100).max(599).optional(),
  })
  .strip();

export const ingestLogsSchema = z.object({
  logs: z.array(logSchema).min(1).max(100),
});

export type LogInput = z.infer<typeof logSchema>;

export type IngestLogsInput = z.infer<typeof ingestLogsSchema>;
