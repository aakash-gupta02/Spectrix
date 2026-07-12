import { z } from "zod";
import {
  type ObjectIdParams,
  objectIdParamsSchema,
} from "../../shared/utils/validation.js";

export const createStatuspageSchema = z
  .object({
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

    logoUrl: z
      .string()
      .trim()
      .url("Please provide a valid logo URL.")
      .optional(),

    serviceIds: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID."))
      .min(1, "Select at least one service."),

    isPublic: z.boolean().default(true),
  })
  .strict();

export const updateStatuspageSchema = createStatuspageSchema.partial().strict();

export const statuspageParamsSchema = objectIdParamsSchema;

// Types
export type CreateStatuspageInput = z.infer<typeof createStatuspageSchema>;
export type StatuspageParamsInput = ObjectIdParams;
export type UpdateStatuspageInput = z.infer<typeof updateStatuspageSchema>;
