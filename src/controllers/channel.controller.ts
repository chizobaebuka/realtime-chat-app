import { Request, Response, NextFunction } from 'express';
import * as service from '../services/channel.service';
import * as ChannelService from '../services/channel.service';
import { channelSchema, memberActionSchema } from '../validators/channel.validator';

export const createChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated = channelSchema.parse(req.body);
        const result = await service.create(validated);
        res.status(201).json({
            message: 'Channel created successfully',
            data: result,
        });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(400).json({ error: err.message });
    }
};

export const getAllChannels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const paginationResult = await ChannelService.getAllChannels(req.query);
        res.status(200).json({
            status: 'success',
            ...paginationResult,
        });
    } catch (error) {
        next(error);
    }
};

export const getChannelById = async (req: Request, res: Response): Promise<void> => {
    try {
        const channel = await service.findById(req.params.id);
        res.status(200).json({
            message: 'Channel retrieved successfully',
            data: channel,
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const updateChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated = channelSchema.partial().parse(req.body);
        const updated = await service.update(req.params.id, validated);
        res.status(200).json({
            message: 'Channel updated successfully',
            data: updated,
        });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(400).json({ error: err.message });
    }
};

export const deleteChannel = async (req: Request, res: Response): Promise<void> => {
    try {
        await service.remove(req.params.id);
        res.status(204).json({
            message: 'Channel deleted successfully',
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const addMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = memberActionSchema.parse(req.body);
        const channel = await service.addMember(req.params.id, userId.toString());
        res.status(200).json({
            message: 'Member added successfully',
            data: channel,
        });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(400).json({ error: err.message });
    }
};

export const removeMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = memberActionSchema.parse(req.body);
        const channel = await service.removeMember(req.params.id, userId.toString());
        res.status(200).json({
            message: 'Member removed successfully',
            data: channel,
        });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(400).json({ error: err.message });
    }
};

export const promoteModerator = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = memberActionSchema.parse(req.body);
        const channel = await service.promoteModerator(req.params.id, userId.toString());
        res.status(200).json(channel);
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(400).json({ error: err.message });
    }
};

export const demoteModerator = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = memberActionSchema.parse(req.body);
        const channel = await service.demoteModerator(req.params.id, userId.toString());
        res.status(200).json(channel);
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(400).json({ error: err.message });
    }
};
