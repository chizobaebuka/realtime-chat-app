import { Request, Response } from 'express';
import {
    registerUser,
    loginUser,
    updateUserById,
    deleteUserById,
    getUsers,
    getUserInfoById
} from '../services/user.service';
import { getPagination } from '../utils/pagination';
import { loginSchema, registerSchema, updateUserSchema } from '../validators/user.validator';
import { Role } from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.errors.map(e => e.message).join(', ') });
            return;
        }
        const { username, email, password, role } = result.data;
        const userRole = role as Role;
        if (userRole && !Object.values(Role).includes(userRole)) {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }
        // Register the user
        const user = await registerUser(username, email, password, userRole);
        res.status(201).json({
            status: 'success',
            message: 'User registered',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err: any) {
        if (err.code === 11000 && err.keyPattern?.email) {
            // Handle duplicate email error
            res.status(400).json({ error: 'Email is already in use' });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.errors.map(e => e.message).join(', ') });
            return;
        }
        const { email, password } = result.data;
        const loginResult = await loginUser(email, password);
        res.status(200).json({
            message: 'User logged in',
            token: loginResult.token,
            user: loginResult.user
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit, skip, page } = getPagination(req.query);
        const users = await getUsers(limit, skip);
        res.status(200).json({
            status: 'success',
            message: 'Users found',
            pagination: { page, limit },
            data: users,
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await getUserInfoById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({
            status: 'success',
            message: 'User found',
            data: user
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = updateUserSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.errors.map(e => e.message).join(', ') });
            return;
        }
        const updatedUser = await updateUserById(req.params.id, result.data);
        res.status(200).json({
            status: 'success',
            message: 'User updated',
            data: updatedUser
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteUserById(req.params.id);
        res.status(200).json({
            message: 'User deleted',
            status: 'success'
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
