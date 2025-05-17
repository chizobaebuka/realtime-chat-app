import { NotificationModel, INotification } from '../models/notification.model';
import { getPagination } from '../utils/pagination';

export const createNotification = (data: Partial<INotification>): Promise<INotification> => {
    return NotificationModel.create(data);
};

export const getUserNotifications = (userId: string, query: any): Promise<INotification[]> => {
    const { limit, skip } = getPagination(query);
    return NotificationModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

export const markNotificationAsRead = (id: string): Promise<INotification | null> => {
    return NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

export const deleteNotification = (id: string): Promise<INotification | null> => {
    return NotificationModel.findByIdAndDelete(id);
};

export const deleteAllUserNotifications = (userId: string): Promise<{ deletedCount?: number }> => {
    return NotificationModel.deleteMany({ user: userId });
};
