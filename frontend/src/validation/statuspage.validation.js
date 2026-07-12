import { z } from "zod";

const serviceIdsSchema = z
  .array(z.string().trim().min(1, "Service is required"))
  .min(1, "Select at least one service");

const optionalTextSchema = z.string().trim().max(300).optional().or(z.literal(""));

export const createStatuspageSettingsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters"),

    description: optionalTextSchema,

    logoUrl: z
      .string()
      .trim()
      .url("Logo must be a valid URL")
      .optional()
      .or(z.literal("")),

    visibility: z.enum(["public", "private"]),

    serviceIds: serviceIdsSchema,
  })
  .strict();

export const updateStatuspageSettingsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .optional(),

    description: optionalTextSchema,

    logoUrl: z
      .string()
      .trim()
      .url("Logo must be a valid URL")
      .optional()
      .or(z.literal("")),

    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(100, "Slug must be less than 100 characters")
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
      .optional(),

    visibility: z.enum(["public", "private"]).optional(),

    serviceIds: serviceIdsSchema.optional(),
  })
  .strict()
  .refine(
    (data) =>
      Boolean(
        data.name ||
          data.description ||
          data.logoUrl ||
          data.slug ||
          data.visibility ||
          (Array.isArray(data.serviceIds) && data.serviceIds.length > 0),
      ),
    {
      message: "At least one field is required",
    },
  );
