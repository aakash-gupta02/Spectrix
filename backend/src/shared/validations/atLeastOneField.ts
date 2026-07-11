import z from "zod";

export const atLeastOneFieldRequired = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  message = "At least one field must be provided.",
) =>
  schema.refine((data) => Object.keys(data).length > 0, {
    message,
  });
