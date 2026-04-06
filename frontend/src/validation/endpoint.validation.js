import { z } from "zod";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const endpointPathSchema = z
    .string()
    .trim()
    .min(1, "Path is required")
    .regex(/^\/[a-zA-Z0-9\-\/]*$/, "Path must start with / and contain valid characters");

function isValidJsonObjectString(value) {
    const trimmed = String(value || "").trim();

    if (!trimmed) {
        return true;
    }

    try {
        const parsed = JSON.parse(trimmed);
        return Boolean(parsed) && !Array.isArray(parsed) && typeof parsed === "object";
    } catch {
        return false;
    }
}

function isValidExpectedStatusString(value) {
    const trimmed = String(value || "").trim();

    if (!trimmed) {
        return true;
    }

    return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .every((code) => {
            const parsed = Number(code);
            return Number.isInteger(parsed) && parsed >= 100 && parsed <= 599;
        });
}

export const createEndpointSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    serviceId: z.string().min(1, "Service is required"),
    method: z.enum(HTTP_METHODS),
    path: endpointPathSchema,
    query: z.record(z.string(), z.string()).optional(),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.any().optional(),
    interval: z.number().int().min(10, "Interval must be at least 10 seconds").default(300),
    expectedStatus: z.array(z.number().int().positive()).optional(),
    active: z.boolean().default(true),
}).strict();

export const updateEndpointSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters").optional(),
    serviceId: z.string().min(1, "Service is required").optional(),
    method: z.enum(HTTP_METHODS).optional(),
    path: endpointPathSchema.optional(),
    query: z.record(z.string(), z.string()).optional(),
    headers: z.record(z.string(), z.string()).optional(),
    body: z.any().optional(),
    interval: z.number().int().min(10, "Interval must be at least 10 seconds").optional(),
    expectedStatus: z.array(z.number().int().positive()).optional(),
    active: z.boolean().optional(),
}).strict();

const endpointFormBaseSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    serviceId: z.string().min(1, "Service is required"),
    method: z.enum(HTTP_METHODS),
    path: endpointPathSchema,
    query: z.string().optional().refine(isValidJsonObjectString, "Query must be a valid JSON object"),
    headers: z.string().optional().refine(isValidJsonObjectString, "Headers must be a valid JSON object"),
    body: z.string().optional(),
    interval: z.coerce.number().int().min(10, "Interval must be at least 10 seconds"),
    expectedStatus: z
        .string()
        .optional()
        .refine(isValidExpectedStatusString, "Expected status codes must be comma-separated HTTP codes"),
    active: z.boolean().default(true),
});

export const createEndpointFormSchema = endpointFormBaseSchema.strict();

export const updateEndpointFormSchema = endpointFormBaseSchema.partial().strict();

export const getEndpointsQuerySchema = z.object({
    serviceId: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
}).strict();

