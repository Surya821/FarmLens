import express from 'express';
import User from '../models/User.js';
import Cattle from '../models/Cattle.js';
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

// Change Password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.googleId && !user.password) {
      return res.status(400).json({ error: 'Google users cannot change their password this way' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Update Usage
router.post('/usage', auth, async (req, res) => {
  const { type } = req.body; // 'ai' or 'symptom'
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const limits = {
      Free: { ai: 10, symptoms: 50 },
      Pro: { ai: 100, symptoms: 500 },
      Enterprise: { ai: Infinity, symptoms: Infinity }
    };

    const userPlan = user.membership || 'Free';
    const currentLimits = limits[userPlan];

    if (type === 'ai') {
      if (user.aiUsage >= currentLimits.ai) {
        return res.status(403).json({ 
          error: 'AI Prediction limit reached', 
          limit: currentLimits.ai,
          plan: userPlan
        });
      }
      user.aiUsage += 1;
    } else if (type === 'symptom') {
      if (user.symptomUsage >= currentLimits.symptoms) {
        return res.status(403).json({ 
          error: 'Symptom analysis limit reached', 
          limit: currentLimits.symptoms,
          plan: userPlan
        });
      }
      user.symptomUsage += 1;
    }

    await user.save();
    res.json({
      aiUsage: user.aiUsage,
      symptomUsage: user.symptomUsage,
      membership: user.membership
    });
  } catch (error) {
    console.error("Usage update error:", error);
    res.status(500).json({ error: 'Failed to update usage' });
  }
});

// Delete user account
router.delete('/delete', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Clean up user's cattle resources
    await Cattle.deleteMany({ owner: req.userId });
    
    res.json({ message: 'Account and associated data deleted successfully' });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;