import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Submit installment inquiry
router.post('/', async (req, res) => {
  try {
    const { name, phone, city, productName, plan, message, productId } = req.body;
    if (!name || !phone || !productName || !plan) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, product, and desired plan are required.' });
    }

    const inquiry = await db.createInstallmentInquiry({
      name,
      phone,
      city: city || 'Lahore',
      productId: productId || '',
      productName,
      plan,
      message: message || ''
    });

    res.status(201).json({
      success: true,
      message: 'Installment inquiry submitted successfully. Hanif Centre representative will contact you with terms and monthly installment schedule.',
      data: inquiry
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit installment inquiry' });
  }
});

// Admin: Get all installment inquiries
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inquiries = await db.getInstallmentInquiries();
    res.json({ success: true, data: inquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch installment inquiries' });
  }
});

// Admin: Update inquiry status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.updateInstallmentStatus(req.params.id, status);
    res.json({ success: true, message: 'Inquiry status updated', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry' });
  }
});

export default router;
