import z from "zod";
import { objectIdParamsSchema, objectIdSchema } from "../../utils/validation.js";

export const getIncidentsQuerySchema = z.object({
    endpointId: objectIdSchema.optional(),
    serviceId: objectIdSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
}).strict();

export const incidentIdParamsSchema = objectIdParamsSchema.strict();


// Types
export type GetIncidentsQuery = z.infer<typeof getIncidentsQuerySchema>;
export type IncidentIdParams = z.infer<typeof incidentIdParamsSchema>;
