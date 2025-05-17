import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io'; 
import * as MessageService from '../services/message.service';
import { messageCreateSchema, messageQuerySchema, idParamSchema } from '../validators/message.validator';
import mongoose from 'mongoose';
import * as RoomService from '../services/room.service'

export const sendMessage = (io: Server) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate the request body using Zod schema
        const parseResult = messageCreateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.errors });
            return;
        }

        const { roomId, ...rest } = parseResult.data;

        // Ensure the room exists using RoomService
        let room;
        if (roomId) {
            room = await RoomService.getRoomById(roomId); // Check if the room exists
            if (!room) {
                res.status(404).json({ error: 'Room not found' });
                return;
            }
        }

        // Prepare message data
        const messageData = {
            ...rest,
            roomId: room ? new mongoose.Types.ObjectId(room._id as string) : undefined, // Use the room's ObjectId
        };

        // Create the message
        const message = await MessageService.createMessage(messageData);

        // Emit the new message to the room
        if (message.roomId) {
            io.to(message.roomId.toString()).emit('newMessage', message);
        }

        // Respond with the created message
        res.status(201).json({ 
            status: 'success',
            message: 'Message sent successfully',
            data: message,
        });
    } catch (error) {
        next(error);
    }
};

export const getMessagesInRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { roomId } = req.params;
        const query = messageQuerySchema.parse(req.query);
        const messages = await MessageService.getMessagesInRoom(roomId, query);
        res.status(200).json({
            status: 'success',
            message: 'Messages retrieved successfully',
            data: messages,
        })
    } catch (error) {
        next(error);
    }
};

export const getMessagesBetweenUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await MessageService.getMessagesBetweenUsers(senderId, receiverId);
        res.status(200).json({ 
            status: 'success',
            message: 'Messages retrieved successfully',
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const query = messageQuerySchema.parse(req.query);
        const limit = query.limit ? parseInt(query.limit) : 20;
        const skip = query.skip ? parseInt(query.skip) : 0;
        const messages = await MessageService.getUserMessages(userId, limit, skip);
        res.status(200).json({ 
            status: 'success',
            message: 'Messages retrieved successfully',
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = idParamSchema.parse(req.params);
        const deleted = await MessageService.deleteMessage(id);
        if (!deleted) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        res.status(200).json({
            status: 'success',
            message: 'Message deleted',
        });
    } catch (error) {
        next(error);
    }
};