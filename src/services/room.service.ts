import mongoose from 'mongoose';
import { IRoom, RoomModel } from '../models/room.model';

export const createRoom = async (data: Partial<IRoom>) => {
    return await RoomModel.create(data);
};

export const getRoomById = async (id: string) => {
    return await RoomModel.findById(id);
};

export const getAllRooms = async () => {
    return await RoomModel.find();
};

export const updateRoom = async (id: string, data: Partial<IRoom>) => {
    return await RoomModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRoom = async (id: string) => {
    const room = await RoomModel.findByIdAndDelete(id);
    return room !== null;
};

export const addMemberToRoom = async (roomId: string, memberId: string) => {
    const room = await RoomModel.findById(roomId);
    if (!room) {
        throw new Error('Room not found');
    }
    if (room.members.includes(new mongoose.Types.ObjectId(memberId))) {
        throw new Error('Member already in room');
    }
    room.members.push(new mongoose.Types.ObjectId(memberId));
    await room.save();
    return room;
};

export const removeMemberFromRoom = async (roomId: string, memberId: string) => {
    const room = await RoomModel.findById(roomId);
    if (!room) {
        throw new Error('Room not found');
    }
    room.members = room.members.filter(member => member.toString() !== memberId);
    await room.save();
    return room;
};

export const getRoomMembers = async (roomId: string) => {
    const room = await RoomModel.findById(roomId).populate('members');
    if (!room) {
        throw new Error('Room not found');
    }
    return room.members;
};


