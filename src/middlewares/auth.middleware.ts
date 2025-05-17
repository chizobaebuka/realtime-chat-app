import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'user' | 'admin' | 'moderator' | 'support';   
    };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            role: 'user' | 'admin' | 'moderator' | 'support';
        };
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

export const authorize = (...allowedRoles: ('user' | 'admin' | 'moderator' | 'support')[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        next();
    };
};

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }

    next();
};