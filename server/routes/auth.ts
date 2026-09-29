import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/db';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Register new customer
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.createUser({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      city: city || 'Lahore',
      role: 'customer'
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        role: newUser.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({
      id: user.id || user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Lahore',
        role: user.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during login' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Lahore',
        role: user.role,
        savedAddresses: user.savedAddresses || []
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, phone, address, city, savedAddresses } = req.body;
    const updated = await db.updateUser(req.user.id, {
      name,
      phone,
      address,
      city,
      savedAddresses
    });
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated.id || updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        role: updated.role,
        savedAddresses: updated.savedAddresses || []
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

export default router;
