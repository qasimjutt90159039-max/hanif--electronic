import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET public store settings
router.get('/', async (req, res) => {
  try {
    const settings = await db.getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

// Admin: Update site settings
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await db.updateSiteSettings(req.body);
    res.json({ success: true, message: 'Site settings updated successfully', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

export default router;
