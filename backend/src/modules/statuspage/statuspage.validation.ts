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
  order: z.number().int().min(0).optional(),
});

const statusPageServicesSchema = z
  .array(statusPageServiceSchema)
  .min(1, "Select at least one service.")
  .refine(
    (services) => {
      const uniqueServiceIds = new Set(
        services.map((service) => service.serviceId),
      );

      return uniqueServiceIds.size === services.length;
    },
    {
      message: "Duplicate services are not allowed.",
    },
  );

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

  serviceIds: statusPageServicesSchema,

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
export const statuspageSlugParamsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),
});

// Types
export type CreateStatuspageInput = z.infer<typeof createStatuspageSchema>;
export type UpdateStatuspageInput = z.infer<typeof updateStatuspageSchema>;
export type StatuspageParamsInput = ObjectIdParams;
export type StatuspageSlugParamsInput = z.infer<
  typeof statuspageSlugParamsSchema
>;
