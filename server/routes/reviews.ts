import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await db.getReviews(req.params.productId);
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Submit a review
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { productId, rating, title, comment, userName, userEmail } = req.body;

    if (!productId || !rating || !title || !comment || !userName) {
      return res.status(400).json({ success: false, message: 'Please provide rating, title, comments, and your name.' });
    }

    const review = await db.addReview({
      productId,
      rating: Number(rating),
      title,
      comment,
      userName,
      userEmail: userEmail || 'guest@example.com'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your product review has been submitted.',
      data: review
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// Admin: Get all reviews
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reviews = await db.getReviews();
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Admin: Moderate review
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const review = await db.moderateReview(req.params.id, status);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: `Review ${status}`, data: review });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update review status' });
  }
});

export default router;
