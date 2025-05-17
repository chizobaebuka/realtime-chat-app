import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChannel extends Document {
    name: string;
    isPrivate: boolean;
    members: Types.ObjectId[]; // References to Users
    moderators: Types.ObjectId[]; // References to Users
    messages: Types.ObjectId[]; // References to Messages
    notifications: Types.ObjectId[]; // References to Notifications
    createdBy: Types.ObjectId;
    createdAt: Date;
}

const channelSchema = new Schema<IChannel>({
    name: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Relationship with User
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Relationship with User
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // Relationship with Message
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }], // Relationship with Notification
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const ChannelModel = mongoose.model<IChannel>('Channel', channelSchema);
