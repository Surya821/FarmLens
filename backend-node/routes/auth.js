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
    // console.log('Register request body:', req.body);

    const { name, mobile, address, password, email } = req.body;

    // Check for missing fields
    if (!name || !mobile || !address || !password) {
      console.log('Missing fields:', { name: !!name, mobile: !!mobile, address: !!address, password: !!password });
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Trim inputs
    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();
    const trimmedAddress = address.trim();
    const trimmedEmail = email ? email.trim().toLowerCase() : undefined;

    // Check if fields are empty after trimming
    if (!trimmedName || !trimmedMobile || !trimmedAddress || !password) {
      return res.status(400).json({
        error: 'All fields must contain valid data'
      });
    }

    // Validate password on server side
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user already exists
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

    // Generate username
    const baseUsername = trimmedName.toLowerCase().replace(/\s+/g, '');
    let username = baseUsername;
    let counter = 1;

    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create new user - password will be hashed by the pre-save middleware
    const user = new User({
      name: trimmedName,
      mobile: trimmedMobile,
      address: trimmedAddress,
      email: trimmedEmail,
      username,
      password: password // Don't hash here - let the model middleware handle it
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    console.log('User registered successfully:', user._id);

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
    console.error('Registration error:', error);

    if (error.code === 11000) {
      // Duplicate key error
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
    // console.log('Login request body:', req.body);

    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        error: 'Mobile number and password are required'
      });
    }

    // Trim mobile number
    const trimmedMobile = mobile.trim();

    // Find user
    const user = await User.findOne({ mobile: trimmedMobile });
    if (!user) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    // Check password using the model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('User logged in successfully:', user._id);

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
    console.error('Login error:', error);
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

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send OTP via email
    await sendOtpEmail(trimmedEmail, otp);
    console.log(`Password reset OTP sent to: ${trimmedEmail}`);

    res.json({ message: 'OTP sent to your email successfully. Please check your inbox.' });
  } catch (error) {
    console.error('Forgot password error:', error);
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

    user.password = newPassword; // gets hashed in pre-save
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
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

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({
      $or: [
        { googleId: googleId },
        { email: email }
      ]
    });

    if (!user) {
      // Create a unique username
      const baseUsername = name.toLowerCase().replace(/\s+/g, '');
      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      // Create new user
      user = new User({
        name,
        email,
        googleId,
        username,
        avatar: picture,
        // Since it's Google login, we provide fallback values for required-ish fields
        mobile: `google_${googleId.substring(0, 10)}`,
        address: 'Google Account'
      });

      await user.save();
      console.log('New user created via Google Login:', user._id);
    } else {
      // If user exists but doesn't have googleId linked (found by email)
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = picture;
        await user.save();
        console.log('Linked Google account to existing user:', user._id);
      }
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate token
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
    console.error('Google Login error:', error);
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
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;