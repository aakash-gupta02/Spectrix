import z from "zod";

export const LogSchema = z
  .object({
    level: z.enum(["info", "warn", "error", "debug"]),

    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(5000, "Message is too long"),

    timestamp: z.string().datetime().optional(),

    metadata: z.record(z.string(), z.unknown()).optional(),

    source: z.string().trim().max(100).optional(),

    endpoint: z.string().trim().max(500).optional(),

    method: z.string().trim().max(10).optional(),

    statusCode: z.number().int().min(100).max(599).optional(),
  })
  .strip();

export const ingestLogSchema = z.object({
  logs: z
    .array(LogSchema)
    .min(1, "At least one log entry is required")
    .max(1000, "Cannot ingest more than 1000 logs at once"),
});

export type IngestLogInput = z.infer<typeof ingestLogSchema>;
