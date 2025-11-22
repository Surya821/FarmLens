import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

const router = express.Router();

// Initialize Twilio client only if credentials are provided
let client;
try {
  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.log('Twilio credentials not found. OTP will be logged to console.');
  }
} catch (error) {
  console.log('Twilio initialization failed. OTP will be logged to console.');
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, isRegistration = false } = req.body;
    
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ mobile });
    
    if (user) {
      user.otp = { code: otp, expiresAt };
      await user.save();
    } else if (isRegistration) {
      // For new registration, create a temporary user record with unique username
      const tempUsername = `temp_${mobile}_${Date.now()}`;
      user = new User({
        mobile,
        otp: { code: otp, expiresAt },
        name: 'Temporary',
        address: 'Temporary',
        username: tempUsername
      });
      await user.save();
    } else {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // Log OTP to console (for development)
    console.log(`OTP for ${mobile}: ${otp}`);
    console.log(`OTP expires at: ${expiresAt}`);
    
    // Try to send OTP via Twilio if client is initialized
    if (client && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await client.messages.create({
          body: `Your FarmLens OTP is: ${otp}. It will expire in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: mobile
        });
        console.log(`OTP sent via SMS to ${mobile}`);
      } catch (twilioError) {
        console.log('Twilio SMS failed:', twilioError.message);
        console.log(`OTP for ${mobile}: ${otp} (Please use this OTP)`);
      }
    } else {
      console.log(`OTP for ${mobile}: ${otp} (Twilio not configured)`);
    }

    res.json({ 
      message: 'OTP sent successfully',
      debug: process.env.NODE_ENV === 'development' ? { otp, expiresAt } : undefined
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, address, otp } = req.body;

    if (!name || !mobile || !address || !otp) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if mobile number already exists with a completed registration
    const existingUser = await User.findOne({ 
      mobile, 
      name: { $ne: 'Temporary' } // Exclude temporary users
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Verify OTP with temporary user
    const user = await User.findOne({ mobile });
    if (!user || !user.otp || user.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Generate username with sequential number
    const baseUsername = name.toLowerCase().replace(/\s+/g, '');
    let username = baseUsername;
    let counter = 1;
    
    // Find the next available username
    while (await User.findOne({ username, _id: { $ne: user._id } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Update user with actual data
    user.name = name;
    user.address = address;
    user.username = username;
    user.otp = undefined; // Clear OTP after successful verification

    await user.save();

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
        mobile: user.mobile,
        username: user.username,
        address: user.address,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP are required' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Clear OTP after successful login
    user.otp = undefined;
    await user.save();

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
        mobile: user.mobile,
        username: user.username,
        address: user.address,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;