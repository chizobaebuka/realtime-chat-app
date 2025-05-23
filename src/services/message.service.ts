// src/services/message.service.ts
import * as MessageRepo from '../repositories/message.repo';
import { IMessage } from '../models/message.model';
import { paginate, PaginationResult } from '../utils/pagination';
import mongoose from 'mongoose';
import { MessageModel } from '../models/message.model';

export const createMessage = async (data: Partial<IMessage>): Promise<IMessage> => {
    // Ensure all ObjectId fields are properly formatted
    if (data.roomId && typeof data.roomId === 'string') {
        data.roomId = new mongoose.Types.ObjectId(data.roomId);
    }
    if (data.sender && typeof data.sender === 'string') {
        data.sender = new mongoose.Types.ObjectId(data.sender);
    }
    if (data.receiver && typeof data.receiver === 'string') {
        data.receiver = new mongoose.Types.ObjectId(data.receiver);
    }
    
    return await MessageRepo.saveMessage(data);
};

export const getMessagesInRoom = async (roomId: string, query: any): Promise<PaginationResult<IMessage>> => {
    const filter = { roomId };
    return await paginate<IMessage>(MessageModel, query, filter);
};

export const getUserMessages = async (userId: string, limit = 20, skip = 0): Promise<IMessage[]> => {
    return await MessageRepo.getMessagesByUser(userId, limit, skip);
};

export const deleteMessage = async (messageId: string): Promise<IMessage | null> => {
    return await MessageRepo.deleteMessageById(messageId);
};

export const getMessagesBetweenUsers = async (
    senderId: string,
    receiverId: string
): Promise<IMessage[]> => {
    return await MessageRepo.getMessagesBySenderAndReceiver(senderId, receiverId);
};