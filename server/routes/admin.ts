import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Dashboard overview metrics & analytics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await db.getAdminStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate admin statistics' });
  }
});

// Customer management list
router.get('/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const customers = await db.getCustomers();
    res.json({ success: true, data: customers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customers' });
  }
});

export default router;
