import { z } from 'zod';
import { Types } from 'mongoose';
// This file contains the Zod schemas for validating notification data.

export const notificationSchema = z.object({
    user: z.custom<Types.ObjectId>((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId',
    }),
    type: z.enum(['message', 'mention', 'invite']),
    content: z.string().min(1, 'Content is required'),
    isRead: z.boolean().optional()
});
