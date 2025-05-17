import { NotificationModel } from '../models/notification.model';
import { UserModel, IUser } from '../models/user.model';

export const findUserByEmail = (email: string): Promise<IUser | null> => {
    return UserModel.findOne({ email });
}

export const createUser = (user: Partial<IUser>): Promise<IUser> => {
    return UserModel.create(user);
}

export const findUserById = async (id: string): Promise<IUser | null> => {
    return await UserModel.findById(id);
}
export const performUpdateUser = async (id: string, user: Partial<IUser>): Promise<IUser | null> => {
    return await UserModel.findByIdAndUpdate(id, user, { new: true });
};
export const deleteUser = async (id: string): Promise<void> => {
    // await UserModel.findByIdAndDelete(id);
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
        throw new Error('User not found');
    }
    // Optionally, you can also delete related notifications here
    await NotificationModel.deleteMany({ user: id });
};

export const findAllUsers = (limit?: number, skip?: number): Promise<IUser[]> => {
    return UserModel.find().limit(limit || 10).skip(skip || 0);
}