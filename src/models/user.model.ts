import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    SUPPORT = 'support',
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
    channels: mongoose.Types.ObjectId[]; // References to channels the user is part of
    notifications: mongoose.Types.ObjectId[]; // References to notifications for the user
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.String, enum: Object.values(Role), default: Role.USER },
    isActive: { type: Boolean, default: true },
    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }], // Relationship with Channel
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }], // Relationship with Notification
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);
