import z from "zod";
import { type ObjectIdParams, objectIdParamsSchema } from "../../utils/validation.js";

export const endpointIdParamsSchema = objectIdParamsSchema;

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
export type GetEndpointTimeseriesQueryInput = z.infer<
  typeof getEndpointTimeseriesQuerySchema
>;
export type GetEndpointTopLevelQueryInput = z.infer<
  typeof getEndpointTopLevelQuerySchema
>;
