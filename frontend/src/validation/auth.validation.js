import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const registerFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(50, "Full name must be less than 50 characters"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be less than 50 characters"),
});