import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const cat = await db.createCategory(req.body);
    res.status(201).json({ success: true, message: 'Category created', data: cat });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cat = await db.updateCategory(req.params.id, req.body);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category updated', data: cat });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

export default router;
