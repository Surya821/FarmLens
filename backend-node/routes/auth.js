import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
    console.log('Register request body:', req.body);
    
    const { name, mobile, address, password } = req.body;

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
    console.log('Login request body:', req.body);
    
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

export default router;