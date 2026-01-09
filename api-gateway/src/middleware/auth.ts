import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@fds/common';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: UserRole;
            };
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // For development/hackathon, we might allow a 'mock-auth' header or bypass if specified
        if (process.env.NODE_ENV === 'development' && req.headers['x-mock-role']) {
            req.user = {
                id: 'mock-user-id',
                role: req.headers['x-mock-role'] as UserRole
            };
            return next();
        }
        return res.sendStatus(401);
    }

    // Mock JWT verification for now (replace with real secret later)
    try {
        // const user = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        // req.user = user;

        // Mock decoding for hackathon speed if no real JWT issued yet
        const decoded = { id: 'user-123', role: UserRole.OFFICER };
        req.user = decoded;

        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.sendStatus(401);
        if (!roles.includes(req.user.role)) return res.sendStatus(403);
        next();
    };
};
