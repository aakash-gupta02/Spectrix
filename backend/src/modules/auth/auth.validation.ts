import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(60),
    email: z.email().transform((val) => val.toLowerCase()),
    password: z.string().min(6).max(100),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.email().transform((val) => val.toLowerCase()),
    password: z.string().min(6).max(100),
  })
  .strict();

export const googleOAuthSchema = z
  .object({
    code: z.string(),
    state: z.string(),
  })
.strip();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;