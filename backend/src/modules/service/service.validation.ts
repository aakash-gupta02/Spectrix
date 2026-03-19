import z from "zod";

import { type ObjectIdParams, objectIdParamsSchema } from "../../utils/validation.js";

const baseUrlSchema = z
  .string()
  .trim()
  .url("BaseUrl must be a valid URL")
  .refine((value) => {
    try {
      const url = new URL(value);

      // Base URL only: protocol + host (+ optional port), optional trailing slash.
      return (
        (url.pathname === "/" || url.pathname === "") &&
        url.search === "" &&
        url.hash === "" &&
        url.username === "" &&
        url.password === ""
      );
    } catch {
      return false;
    }
  }, "Only a base URL is allowed (no path, query, or hash)")
  .transform((value) => {
    const url = new URL(value);

    // Store canonical base URL without trailing slash.
    return `${url.protocol}//${url.host}`;
  });

export const serviceIdParamsSchema = objectIdParamsSchema;

export const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(100, "Description must be less than 100 characters").optional(),
  baseUrl: baseUrlSchema,
  environment: z.enum(["production", "staging", "development"]).default("development"),
  active: z.boolean().default(true),

}).strict();

export const updateServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters").optional(),
  description: z.string().max(100, "Description must be less than 100 characters").optional(),
  baseUrl: baseUrlSchema.optional(),
  environment: z.enum(["production", "staging", "development"]).default("development").optional(),
  active: z.boolean().default(true).optional(),
  
}).strict();

export const serviceListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
}).strict();

export type ServiceIdParamsInput = ObjectIdParams;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceListQueryInput = z.infer<typeof serviceListQuerySchema>;