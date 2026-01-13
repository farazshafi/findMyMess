import { Request, Response, NextFunction } from 'express';

const ADMIN_KEY = process.env.ADMIN_KEY;

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const providedKey = req.headers['x-admin-key'];

    if (!ADMIN_KEY) {
        console.error('ADMIN_KEY is not set in environment variables');
        return res.status(500).json({ error: 'Internal server error: Admin configuration missing' });
    }

    if (providedKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
    }

    next();
};
