// File: src/services/notification.service.ts
import * as repo from '../repositories/notification.repo';
import { INotification } from '../models/notification.model';

export const create = (data: Partial<INotification>): Promise<INotification> => repo.createNotification(data);
export const listByUser = (userId: string, query: Record<string, any> = {}): Promise<INotification[]> => {
    return repo.getUserNotifications(userId, { query });
};
export const markRead = (id: string): Promise<INotification | null> => repo.markNotificationAsRead(id);
export const remove = (id: string): Promise<INotification | null> => repo.deleteNotification(id);
export const clearAll = (userId: string): Promise<{ deletedCount?: number }> => repo.deleteAllUserNotifications(userId);
