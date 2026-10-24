import { z } from "zod";
import { providers } from "./auth.constant.js";

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

export const aiCredentialsSchema = z
  .object({
    enabled: z.boolean(), // required — always send it
    provider: z.enum(providers).optional(),
    model: z.string().min(1).optional(),
    apiKey: z.string().min(1).nullable().optional(), // string | null | undefined
    baseUrl: z.string().url().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // When disabled, provider/model/key are irrelevant — allow anything.
    if (!data.enabled) return;

    if (!data.provider) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["provider"],
        message: "provider is required when enabled is true",
      });
    }

    if (!data.model) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["model"],
        message: "model is required when enabled is true",
      });
    }

    if (data.provider === "ollama") {
      if (!data.baseUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["baseUrl"],
          message: "baseUrl is required for ollama",
        });
      }
    } else if (data.provider) {
      // Non-ollama providers need an apiKey — either provided now or already stored.
      // The service checks "already stored" — validator only checks the shape.
      if (data.apiKey === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["apiKey"],
          message: "apiKey cannot be null when enabling a key-based provider",
        });
      }
    }
  });

export type AiCredentialsInput = z.infer<typeof aiCredentialsSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;