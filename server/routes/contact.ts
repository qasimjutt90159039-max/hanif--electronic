import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Submit contact inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone, and message are required.' });
    }

    const saved = await db.createContactMessage({
      name,
      email: email || '',
      phone,
      subject: subject || 'General Store Inquiry',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Hanif Centre Lahore support will reach out to you shortly.',
      data: saved
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit contact message' });
  }
});

// Admin: Get all messages
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await db.getContactMessages();
    res.json({ success: true, data: messages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Admin: Mark message read
router.put('/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await db.markMessageRead(req.params.id);
    res.json({ success: true, message: 'Message marked as read', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
});

export default router;
