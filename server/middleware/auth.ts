import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/db';

const JWT_SECRET = process.env.JWT_SECRET || 'hanif_centre_secure_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: any;
}

export function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }
    req.user = {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication session.' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
  }
  next();
}
