import z from "zod";
import { type ObjectIdParams, objectIdParamsSchema } from "../../utils/validation.js";

export const endpointIdParamsSchema = objectIdParamsSchema;
export const serviceIdQuerySchema = z
  .object({
    serviceId: z
      .string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")
      .optional(),
    topErrorsLimit: z.coerce.number().int().positive().max(20).default(5),
  })
  .strict();

export const getEndpointTimeseriesQuerySchema = z
  .object({
    hours: z.coerce.number().int().positive().max(24 * 30).default(24),
    bucketMinutes: z.coerce.number().int().positive().max(60).default(60),
    timezone: z.string().trim().min(1).default("UTC"),
  })
  .strict();

export const getEndpointTopLevelQuerySchema = z
  .object({
    hours: z.coerce.number().int().positive().max(24 * 30).default(24),
  })
  .strict();

export type EndpointIdParams = ObjectIdParams;
export type ServiceIdQueryInput = z.infer<typeof serviceIdQuerySchema>;
export type OverviewQueryInput = z.infer<typeof serviceIdQuerySchema>;
export type GetEndpointTimeseriesQueryInput = z.infer<
  typeof getEndpointTimeseriesQuerySchema
>;
export type GetEndpointTopLevelQueryInput = z.infer<
  typeof getEndpointTopLevelQuerySchema
>;
