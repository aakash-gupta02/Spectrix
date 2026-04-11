import z from "zod";
import { type ObjectIdParams, objectIdParamsSchema, objectIdSchema } from "../../utils/validation.js";

// Create schema 
export const createEndpointSchema = z.object({
    serviceId: objectIdSchema,

    name: z.string().min(1).max(50),

    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),

    path: z.string().regex(/^\/[a-zA-Z0-9\-\/]*$/, "Invalid path format"),

    query: z.record(z.string(), z.string()).optional(),

    headers: z.record(z.string(), z.string()).optional(),

    body: z.any().optional(),

    interval: z.number().min(10).default(300),

    expectedStatus: z.array(z.number().int().positive()).optional(),
    active: z.boolean().default(true),
    retries: z.number().int().min(1).max(3).default(1),
}).strict();

// Update schema 
export const updateEndpointSchema = z.object({
    name: z.string().min(1).max(50).optional(),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
    path: z.string().regex(/^\/[a-zA-Z0-9\-\/]*$/, "Invalid path format").optional(),
    query: z.record(z.string(), z.string()).optional(),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.any().optional(),
    interval: z.number().min(10).default(300).optional(),
    expectedStatus: z.array(z.number().int().positive()).optional(),
    active: z.boolean().optional(),
    retries: z.number().int().min(1).max(3).default(1).optional(),
}).strict();

export const getEndpointsQuerySchema = z.object({
    serviceId: objectIdSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
}).strict();

// Params schema
export const endpointIdParamsSchema = objectIdParamsSchema;


// Types
export type CreateEndpointInput = z.infer<typeof createEndpointSchema>;
export type UpdateEndpointInput = z.infer<typeof updateEndpointSchema>;
export type EndpointIdParams = z.infer<typeof endpointIdParamsSchema>;
export type GetEndpointsQueryInput = z.infer<typeof getEndpointsQuerySchema>;