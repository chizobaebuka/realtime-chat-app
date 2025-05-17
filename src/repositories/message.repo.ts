import { MessageModel, IMessage } from '../models/message.model';

export const saveMessage = async (message: Partial<IMessage>): Promise<IMessage> => {
    const createdMessage = await MessageModel.create(message);
    return createdMessage.save();
}

export const getMessagesByRoom = (roomId: string): Promise<IMessage[]> => {
    return MessageModel.find({ roomId }).sort({ createdAt: 1 });
}

export const getMessagesByUser = (userId: string, limit: number, skip: number): Promise<IMessage[]> => {
    return MessageModel.find({ $or: [{ sender: userId }, { receiver: userId }] })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
}

export const getMessageById = (id: string): Promise<IMessage | null> => {
    return MessageModel.findById(id);
}

export const deleteMessageById = (id: string): Promise<IMessage | null> => {
    return MessageModel.findByIdAndDelete(id);
}

export const getMessagesBySenderAndReceiver = (senderId: string, receiverId: string): Promise<IMessage[]> => {
    return MessageModel.find({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    }).sort({ createdAt: 1 });
}

export const getMessagesByRoomAndSender = (roomId: string, senderId: string): Promise<IMessage[]> => {
    return MessageModel.find({ roomId, sender: senderId }).sort({ createdAt: 1 });
}

export const getMessagesByRoomAndReceiver = (roomId: string, receiverId: string): Promise<IMessage[]> => {
    return MessageModel.find({ roomId, receiver: receiverId }).sort({ createdAt: 1 });
}

// get all messages for user in a room

export const getMessagesByRoomForUser = (roomId: string, userId: string): Promise<IMessage[]> => {
    return MessageModel.find({ roomId, $or: [{ sender: userId }, { receiver: userId }] }).sort({ createdAt: 1 });
}

export function getMessagesByRoomWithPagination(roomId: string, limit: number, skip: number): IMessage[] | PromiseLike<IMessage[]> {
    return MessageModel.find({ roomId }).sort({ createdAt: 1 }).limit(limit).skip(skip);
}

