import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import auth from '../middleware/auth.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

// Check MongoDB connection middleware - Fixed version
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database connection not available. Please try again later.'
    });
  }
  next();
};

// Password validation function
const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  if (!requirements.length) return { valid: false, error: 'Password must be at least 8 characters long' };
  if (!requirements.uppercase) return { valid: false, error: 'Password must contain at least one uppercase letter' };
  if (!requirements.lowercase) return { valid: false, error: 'Password must contain at least one lowercase letter' };
  if (!requirements.number) return { valid: false, error: 'Password must contain at least one number' };
  if (!requirements.special) return { valid: false, error: 'Password must contain at least one special character' };

  return { valid: true };
};

// Register new user
router.post('/register', checkDBConnection, async (req, res) => {
  try {
    const { name, mobile, address, password, email } = req.body;

    if (!name || !mobile || !address || !password) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();
    const trimmedAddress = address.trim();
    const trimmedEmail = email ? email.trim().toLowerCase() : undefined;

    if (!trimmedName || !trimmedMobile || !trimmedAddress || !password) {
      return res.status(400).json({
        error: 'All fields must contain valid data'
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    const existingUser = await User.findOne({ mobile: trimmedMobile });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this mobile number already exists' });
    }

    if (trimmedEmail) {
      const existingEmail = await User.findOne({ email: trimmedEmail });
      if (existingEmail) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
    }

    const baseUsername = trimmedName.toLowerCase().replace(/\s+/g, '');
    let username = baseUsername;
    let counter = 1;

    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    const user = new User({
      name: trimmedName,
      mobile: trimmedMobile,
      address: trimmedAddress,
      email: trimmedEmail,
      username,
      password: password
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        username: user.username,
        address: user.address,
        avatar: user.avatar
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `${field === 'mobile' ? 'Mobile number' : 'Username'} already registered`
      });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login user
router.post('/login', checkDBConnection, async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        error: 'Mobile number and password are required'
      });
    }

    const trimmedMobile = mobile.trim();

    const user = await User.findOne({ mobile: trimmedMobile });
    if (!user) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        username: user.username,
        address: user.address,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Forgot Password
router.post('/forgot-password', checkDBConnection, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendOtpEmail(trimmedEmail, otp);

    res.json({ message: 'OTP sent to your email successfully. Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP. Please check your email address and try again.' });
  }
});

// Reset Password
router.post('/reset-password', checkDBConnection, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Reset password failed' });
  }
});

// Google Login
router.post('/google-login', checkDBConnection, async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({
      $or: [
        { googleId: googleId },
        { email: email }
      ]
    });

    if (!user) {
      const baseUsername = name.toLowerCase().replace(/\s+/g, '');
      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = new User({
        name,
        email,
        googleId,
        username,
        avatar: picture,
        mobile: `google_${googleId.substring(0, 10)}`,
        address: 'Google Account'
      });

      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
      user.lastLogin = new Date();
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        username: user.username,
        address: user.address,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Google authentication failed. Please try again.' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      username: user.username,
      address: user.address,
      avatar: user.avatar,
      isPremium: user.isPremium,
      membership: user.membership
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;