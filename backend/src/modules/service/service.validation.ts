import z from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(100, "Description must be less than 100 characters").optional(),
  BaseUrl: z.string().url("BaseUrl must be a valid URL"),
  environment: z.enum(["production", "staging", "development"]).default("development"),
  active: z.boolean().default(true),


});

export const updateServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters").optional(),
  description: z.string().max(100, "Description must be less than 100 characters").optional(),
  BaseUrl: z.string().url("BaseUrl must be a valid URL").optional(),
  environment: z.enum(["production", "staging", "development"]).default("development").optional(),
  active: z.boolean().default(true).optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;