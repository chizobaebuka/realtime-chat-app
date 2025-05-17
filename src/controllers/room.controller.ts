import { Request, Response, NextFunction } from 'express';
import * as RoomService from '../services/room.service';
import { idParamSchema, roomCreateSchema, roomUpdateSchema } from '../validators/room.validator';
import mongoose from 'mongoose';

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const roomData = roomCreateSchema.parse(req.body);
        const room = await RoomService.createRoom({
            ...roomData,
            members: roomData.members?.map(member => new mongoose.Types.ObjectId(member)),
        });
        res.status(201).json({
            status: 'success',
            message: 'Room created successfully',
            data: room,
        });
    } catch (error) {
        next(error);
    }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = idParamSchema.parse(req.params);
        const room = await RoomService.getRoomById(id);
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: room,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const rooms = await RoomService.getAllRooms();
        res.status(200).json({
            status: 'success',
            data: rooms,
        });
    } catch (error) {
        next(error);
    }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = idParamSchema.parse(req.params);
        const roomData = roomUpdateSchema.parse(req.body);
        const updatedRoom = await RoomService.updateRoom(id, {
            ...roomData,
            members: roomData.members?.map(member => new mongoose.Types.ObjectId(member)),
        });
        if (!updatedRoom) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        res.status(200).json({
            status: 'success',
            message: 'Room updated successfully',
            data: updatedRoom,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = idParamSchema.parse(req.params);
        const deleted = await RoomService.deleteRoom(id);
        if (!deleted) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        res.status(200).json({
            status: 'success',
            message: 'Room deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const addMemberToRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { roomId, memberId } = req.params;
        const room = await RoomService.addMemberToRoom(roomId, memberId);
        res.status(200).json({
            status: 'success',
            message: 'Member added to room successfully',
            data: room,
        });
    } catch (error) {
        next(error);
    }
};

export const removeMemberFromRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { roomId, memberId } = req.params;
        const room = await RoomService.removeMemberFromRoom(roomId, memberId);
        res.status(200).json({
            status: 'success',
            message: 'Member removed from room successfully',
            data: room,
        });
    } catch (error) {
        next(error);
    }
};

export const getRoomMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { roomId } = req.params;
        const members = await RoomService.getRoomMembers(roomId);
        res.status(200).json({
            status: 'success',
            message: 'Room members retrieved successfully',
            data: members,
        });
    } catch (error) {
        next(error);
    }
};