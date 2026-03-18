import express from 'express';
import crypto from 'crypto';
import ApiKey from '../models/ApiKey.js';
import UsageLog from '../models/UsageLog.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Generate a random secure API Key
const generateApiKey = () => {
  return `fl_${crypto.randomBytes(32).toString('hex')}`;
};

// Create a new API Key
router.post('/generate', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Key name is required' });

  try {
    const rawKey = generateApiKey();
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyHint = `${rawKey.substring(0, 6)}...${rawKey.slice(-4)}`;

    const newKey = new ApiKey({
      user: req.userId,
      name,
      keyHash: hashedKey,
      keyHint
    });

    await newKey.save();

    // Show the raw key ONLY once
    res.status(201).json({
      name: newKey.name,
      apiKey: rawKey,
      keyHint,
      createdAt: newKey.createdAt
    });
  } catch (error) {
    console.error('Error creating API Key:', error);
    res.status(500).json({ error: 'Failed to generate API Key' });
  }
});

// List all API Keys for the user (names and hints ONLY)
router.get('/', auth, async (req, res) => {
  try {
    const keys = await ApiKey.find({ user: req.userId, isActive: true })
      .select('name keyHint lastUsed createdAt')
      .sort({ createdAt: -1 });
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Revoke an API Key
router.delete('/:id', auth, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ _id: req.params.id, user: req.userId });
    if (!key) return res.status(404).json({ error: 'API key not found' });

    key.isActive = false;
    await key.save();
    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

// Get usage stats for developer dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    // 1. Get user quota
    const user = await User.findById(req.userId);
    
    // 2. Aggregate logs for stats (e.g. last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await UsageLog.aggregate([
      { $match: { user: user._id, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      membership: user.membership,
      aiUsage: user.aiUsage,
      symptomUsage: user.symptomUsage,
      usageLogs: logs
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
});

export default router;
