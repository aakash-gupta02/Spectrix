import z from 'zod';
import { objectIdSchema } from '../../utils/validation.js';

export const getLogsQuerySchema = z.object({
    endpointId: objectIdSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
}).strict();

export type GetLogsQueryInput = z.infer<typeof getLogsQuerySchema>;