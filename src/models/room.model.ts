import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRoom extends Document {
    name: string;
    members: Types.ObjectId[]; // References to User documents
    isPrivate: boolean; // Indicates if the room is private
}

const roomSchema = new Schema<IRoom>({
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Relationship with User
    isPrivate: { type: Boolean, default: false },
}, {
    timestamps: true  
});

export const RoomModel = mongoose.model<IRoom>('Room', roomSchema);
