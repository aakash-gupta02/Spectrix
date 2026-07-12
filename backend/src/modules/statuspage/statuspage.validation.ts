import { z } from "zod";
import {
  type ObjectIdParams,
  objectIdParamsSchema,
  objectIdSchema,
} from "../../shared/validations/idParams.js";
import { atLeastOneFieldRequired } from "../../shared/validations/atLeastOneField.js";

// serviceID Schema 
const statusPageServiceSchema = z.object({
  serviceId: objectIdSchema,
  order: z.number().int().min(0).default(0).optional(),
});

// Base statuspage Schema
export const baseStatuspageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters.")
    .optional(),

  logoUrl: z.string().trim().url("Please provide a valid logo URL.").optional(),

  serviceIds: z
    .array(statusPageServiceSchema)
    .min(1, "Select at least one service."),

  isPublic: z.boolean().default(true),
});

// Create Schema
export const createStatuspageSchema = baseStatuspageSchema.strict();

// Update Schema
export const updateStatuspageSchema = atLeastOneFieldRequired(
  baseStatuspageSchema
    .extend({
      slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(100)
        .regex(
          /^[a-z0-9-]+$/,
          "Slug can only contain lowercase letters, numbers, and hyphens.",
        )
        .optional(),
    })
    .partial()
    .strict(),
);

// Params Schema
export const statuspageParamsSchema = objectIdParamsSchema;

// Types
export type CreateStatuspageInput = z.infer<typeof createStatuspageSchema>;
export type StatuspageParamsInput = ObjectIdParams;
export type UpdateStatuspageInput = z.infer<typeof updateStatuspageSchema>;
