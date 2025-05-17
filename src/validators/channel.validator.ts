import { z } from 'zod';
import { objectIdSchema } from './message.validator';

export const channelSchema = z.object({
    name: z.string().min(1, 'Channel name is required'),
    isPrivate: z.boolean().optional(),
    createdBy: objectIdSchema
});

export const memberActionSchema = z.object({
    userId: objectIdSchema,
});