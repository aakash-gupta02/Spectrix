import z from "zod";
import { type ObjectIdParams, objectIdParamsSchema } from "../../utils/validation.js";

// Validation Schemas
export const createStreamSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    serviceId: objectIdParamsSchema,
});

export const getStreamSchema = objectIdParamsSchema;
export const deleteStreamSchema = objectIdParamsSchema;

// Types
export type CreateStreamInput = z.infer<typeof createStreamSchema>;
export type GetStreamInput = ObjectIdParams;
export type DeleteStreamInput = ObjectIdParams;