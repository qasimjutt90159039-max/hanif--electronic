import { Router } from 'express';
import { db } from '../db/db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Create new order (Public or Authenticated)
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { customer, items, paymentMethod, couponCode } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({ success: false, message: 'Please provide full delivery details: name, phone, city, and address.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
    }

    // Backend validation of items and prices
    const validatedItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const prod = await db.getProductById(item.productId);
      if (!prod) {
        return res.status(400).json({ success: false, message: `Product not found or unavailable.` });
      }

      if (prod.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity for "${prod.name}" exceeds current available stock (${prod.stock} left).`
        });
      }

      const itemTotal = prod.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: prod.id || prod._id,
        name: prod.name,
        sku: prod.sku,
        price: prod.price,
        quantity: item.quantity,
        thumbnail: prod.thumbnail || (prod.images && prod.images[0]) || '',
        brand: prod.brand
      });
    }

    // Coupon verification
    let discount = 0;
    let validatedCoupon = '';
    if (couponCode) {
      const couponCheck = await db.validateCoupon(couponCode, subtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        discount = couponCheck.coupon.discount;
        validatedCoupon = couponCheck.coupon.code;
      }
    }

    // Flat delivery policy: Rs. 1000 for standard city delivery, or 0 if promo
    const deliveryFee = subtotal > 100000 ? 0 : 1500;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    // Optional user attachment if token provided
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'hanif_centre_secure_jwt_secret_key_2026');
        userId = decoded.id;
      } catch (e) {
        // guest order
      }
    }

    const newOrder = await db.createOrder({
      customer,
      items: validatedItems,
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode: validatedCoupon,
      paymentMethod: paymentMethod || 'cod',
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message });
  }
});

// Track Order
router.get('/track', async (req, res) => {
  try {
    const { orderNumber, phone } = req.query;
    if (!orderNumber || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide both Order Number and Phone Number.' });
    }

    const order = await db.trackOrder(orderNumber as string, phone as string);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No matching order found with the provided details. Please verify your order number and registered phone number.'
      });
    }

    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
});

// Customer: Get my orders
router.get('/my-orders', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const orders = await db.getOrders({ userId: req.user.id });
    res.json({ success: true, data: orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer orders' });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderStatus, search } = req.query;
    const orders = await db.getOrders({
      orderStatus: orderStatus as string,
      search: search as string
    });
    res.json({ success: true, data: orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get single order by ID or Order Number
router.get('/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Admin: Update order status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ success: false, message: 'Order status is required' });
    }

    const updated = await db.updateOrderStatus(req.params.id, orderStatus, note);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: `Order status updated to ${orderStatus}`, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

export default router;
