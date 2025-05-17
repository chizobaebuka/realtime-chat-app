import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    user: Types.ObjectId;
    type: 'message' | 'mention' | 'invite';
    content: string;
    isRead: boolean;
    messageId?: Types.ObjectId; // Reference to Message
    channelId?: Types.ObjectId; // Reference to Channel
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['message', 'mention', 'invite'], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' }, // Relationship with Message
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel' }, // Relationship with Channel
    createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);
