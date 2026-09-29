import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Validate coupon during checkout
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const result = await db.validateCoupon(code, Number(subtotal) || 0);
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      message: 'Coupon code applied successfully',
      data: result.coupon
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to validate coupon' });
  }
});

// Admin: Get all coupons
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupons = await db.getCoupons();
    res.json({ success: true, data: coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
});

// Admin: Create coupon
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, discountType, amount, minOrder } = req.body;
    if (!code || !amount) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount amount are required' });
    }

    const created = await db.createCoupon({
      code,
      discountType: discountType || 'percentage',
      amount: Number(amount),
      minOrder: Number(minOrder) || 0,
      maxDiscount: req.body.maxDiscount ? Number(req.body.maxDiscount) : 10000,
      expiryDate: req.body.expiryDate || new Date(Date.now() + 365 * 86400000).toISOString(),
      usageLimit: req.body.usageLimit ? Number(req.body.usageLimit) : 100
    });

    res.status(201).json({ success: true, message: 'Coupon created successfully', data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
});

// Admin: Delete coupon
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.deleteCoupon(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
});

export default router;
