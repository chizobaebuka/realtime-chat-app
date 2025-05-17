import { Request, Response } from 'express';
import * as service from '../services/notification.service';
import { notificationSchema } from '../validators/notification.validator';

export const createNotification = async (req: Request, res: Response) => {
    try {
        const validated = notificationSchema.parse(req.body);
        const notification = await service.create(validated);
        res.status(201).json({
            status: 'success',
            message: 'Notification created',
            notification
        });
    } catch (err: any) {
        if (err.name === 'ZodError') {
            res.status(400).json({ error: err.errors });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
};

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        const notifications = await service.listByUser(req.params.userId, { page: pageNumber, limit: limitNumber });
        res.status(200).json({
            status: 'success',
            message: 'Notifications retrieved',
            notifications
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const result = await service.markRead(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Notification marked as read',
            notification: result
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const deleted = await service.remove(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Notification deleted',
            notification: deleted
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteAll = async (req: Request, res: Response) => {
    try {
        const result = await service.clearAll(req.params.userId);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};