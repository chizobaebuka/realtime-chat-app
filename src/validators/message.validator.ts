// src/validators/message.validator.ts
// import { z } from 'zod';

// export const createMessageSchema = z.object({
//     sender: z.string().length(24, 'Invalid sender ID'),
//     receiver: z.string().length(24, 'Invalid receiver ID'),
//     content: z.string().min(1, 'Content is required'),
//     roomId: z.string().optional(),
// });

// export const getMessagesByRoomSchema = z.object({
//     roomId: z.string().min(1, 'Room ID is required'),
// });

import mongoose from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = z.custom<mongoose.Types.ObjectId>(
    (value) => mongoose.Types.ObjectId.isValid(value),
    { message: 'Invalid ObjectId' }
);

export const messageCreateSchema = z.object({
    sender: objectIdSchema,
    receiver: objectIdSchema,
    content: z.string().min(1, 'Message content is required'),
    roomId: z.string().length(24, 'Invalid room ID').optional()
});

export const messageQuerySchema = z.object({
    limit: z.string().optional(),
    skip: z.string().optional()
});

export const idParamSchema = z.object({
    id: z.string().length(24, 'Invalid ID')
});

export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
export type MessageQueryInput = z.infer<typeof messageQuerySchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;