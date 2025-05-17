import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    content: string;
    roomId?: Types.ObjectId; // Reference to Room
    channelId?: Types.ObjectId; // Reference to Channel
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' }, // Relationship with Room
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel' }, // Relationship with Channel
    createdAt: { type: Date, default: Date.now }
});

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);