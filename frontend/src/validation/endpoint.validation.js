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

export const createEndpointFormSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    serviceId: z.string().min(1, "Service is required"),
    method: z.enum(HTTP_METHODS),
    path: endpointPathSchema,
    query: z.string().optional().refine(isValidJsonObjectString, "Query must be a valid JSON object"),
    headers: z.string().optional().refine(isValidJsonObjectString, "Headers must be a valid JSON object"),
    body: z.string().optional(),
    interval: z.coerce.number().int().min(10, "Interval must be at least 10 seconds"),
    expectedStatus: z.string().optional().refine(isValidExpectedStatusString, "Expected status codes must be comma-separated HTTP codes"),
    active: z.boolean().default(true),
    retries: z.coerce.number().int().min(1, "Retries must be 1 or more").max(3, "Retries must be 3 or less").default(1),
}).strict();

// For updates, just reuse with .partial()
export const updateEndpointFormSchema = createEndpointFormSchema.partial().strict();

export const getEndpointsQuerySchema = z.object({
    serviceId: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
}).strict();

