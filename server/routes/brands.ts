import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const brands = await db.getBrands();
    res.json({ success: true, data: brands });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch brands' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }
    const brand = await db.createBrand(req.body);
    res.status(201).json({ success: true, message: 'Brand created', data: brand });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create brand' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const brand = await db.updateBrand(req.params.id, req.body);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.json({ success: true, message: 'Brand updated', data: brand });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update brand' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.deleteBrand(req.params.id);
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete brand' });
  }
});

export default router;
