import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true }
    ).select('-password -otp');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update avatar
router.put('/avatar', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: req.body.avatar },
      { new: true }
    ).select('-password -otp');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

export default router;