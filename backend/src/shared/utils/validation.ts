import { type ParamsDictionary } from "express-serve-static-core";
import z from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const objectIdParamsSchema = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export type ObjectIdParamsInput = z.infer<typeof objectIdParamsSchema>;

export interface ObjectIdParams extends ParamsDictionary {
  id: string;
}
