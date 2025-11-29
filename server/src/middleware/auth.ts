import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export interface AuthRequest extends Request {
    userId?: ObjectId;
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ error: 'Server configuration error' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.userId = new ObjectId(decoded.userId);
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};
