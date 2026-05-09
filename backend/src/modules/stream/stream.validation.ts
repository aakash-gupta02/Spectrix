import z from "zod";
import {
  objectIdParamsSchema,
  objectIdSchema,
} from "../../utils/validation.js";

// Validation Schemas
export const createStreamSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  serviceId: objectIdSchema,
});

export const updateStreamSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be less than 50 characters")
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.isActive !== undefined, {
    message: "At least one field must be provided for update",
  });

export const getStreamSchema = objectIdParamsSchema;
export const deleteStreamSchema = objectIdParamsSchema;

// Types
export type CreateStreamInput = z.infer<typeof createStreamSchema>;
export type GetStreamInput = z.infer<typeof getStreamSchema>;
export type UpdateStreamInput = z.infer<typeof updateStreamSchema>;
export type DeleteStreamInput = z.infer<typeof deleteStreamSchema>;
