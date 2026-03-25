

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();


import authRoutes from './routes/auth.js';
import cattleRoutes from './routes/cattle.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import messageRoutes from './routes/message.js';
import breedRoutes from './routes/breed.js';
import taskRoutes from './routes/task.js';
import paymentRoutes from './routes/payment.js';
import diseaseRoutes from './routes/disease.js';
import apiKeyRoutes from './routes/api-keys.js';
import v1Routes from './routes/v1.js';
import chatbotRoutes from './routes/chatbot.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Update this to your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

// Allow Google OAuth popups to postMessage back to the opener
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cattle', cattleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/chatbot', chatbotRoutes);

// MongoDB Connection — requires MONGODB_URI to be set in .env (Atlas)
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Please configure your MongoDB Atlas connection string in .env');
  process.exit(1);
}

// MongoDB connection options (Atlas-compatible)
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
  socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
};

// Function to connect to MongoDB
const connectWithRetry = () => {
  console.log('Attempting MongoDB connection...');
  console.log('MongoDB URI:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://USERNAME:PASSWORD@'));
  
  mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('Database Name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

// Start connection
connectWithRetry();

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

// Basic route for testing
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const mongoStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[mongoStatus] || 'unknown';
  
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: {
      status: mongoStatusText,
      readyState: mongoStatus
    }
  });
});

// Test route without MongoDB dependency
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is responding without MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Handle preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
});

export default app;