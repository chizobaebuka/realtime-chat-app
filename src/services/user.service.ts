import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById, deleteUser, findAllUsers, performUpdateUser } from '../repositories/user.repo';
import { Role } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const registerUser = async (username: string, email: string, password: string, role: Role = Role.USER) => {
    const existing = await findUserByEmail(email);
    if (existing) throw new Error('User already exists');
    const hash = await bcrypt.hash(password, 10);
    return createUser({ username, email, password: hash, role }); 
};

export const loginUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
};

export const getUserInfoById = async (id: string) => {
    return findUserById(id);
};

export const updateUserById = async (id: string, user: Partial<any>) => {
    return performUpdateUser(id, user);
};

export const deleteUserById = async (id: string) => {
    return deleteUser(id);
};

export const getUsers = async (limit: number = 10, skip: number = 0) => {
    return findAllUsers(limit, skip);
};