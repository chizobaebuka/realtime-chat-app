import { z } from 'zod';

export const objectIdSchema = z.string().length(24, 'Invalid ObjectId'); // For validating MongoDB ObjectIds

export const roomCreateSchema = z.object({
    name: z.string().min(1, 'Room name is required'), // Room name
    isPrivate: z.boolean().optional(), // Optional privacy flag
    members: z.array(objectIdSchema).optional(), // Optional array of member ObjectIds
});

export const roomUpdateSchema = z.object({
    name: z.string().optional(),
    isPrivate: z.boolean().optional(),
    members: z.array(objectIdSchema).optional(),
});

export const idParamSchema = z.object({
    id: z.string().length(24, 'Invalid ID'),
});

export type RoomCreateInput = z.infer<typeof roomCreateSchema>;
export type RoomUpdateInput = z.infer<typeof roomUpdateSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;