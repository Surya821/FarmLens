import crypto from 'crypto';
import ApiKey from '../models/ApiKey.js';
import User from '../models/User.js';

const apiKeyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const providedKey = authHeader.split(' ')[1];
  
  // Use SHA-256 to hash the provided key same as when saved
  const hashedKey = crypto.createHash('sha256').update(providedKey).digest('hex');

  try {
    const apiKeyDoc = await ApiKey.findOne({ keyHash: hashedKey, isActive: true }).populate('user');

    if (!apiKeyDoc) {
      return res.status(403).json({ error: 'Invalid or revoked API key' });
    }

    const { user } = apiKeyDoc;
    if (!user) {
      return res.status(403).json({ error: 'User associated with this key no longer exists' });
    }

    // Attach user and key info to request
    req.userId = user._id;
    req.user = user;
    req.apiKeyId = apiKeyDoc._id;

    // Check Plan Limits & Quotas
    const limits = {
      Free: { ai: 10, symptoms: 50 },
      Pro: { ai: 100, symptoms: 500 },
      Enterprise: { ai: Infinity, symptoms: Infinity }
    };

    const currentLimits = limits[user.membership || 'Free'];

    // Specific endpoint-based checks can be added here
    // For now, let's just make sure the user hasn't exceeded total limits
    if (req.path.includes('/breed') || req.path.includes('/skin')) {
      if (user.aiUsage >= currentLimits.ai) {
        return res.status(429).json({ error: 'AI Prediction quota exceeded', limit: currentLimits.ai });
      }
    } else if (req.path.includes('/symptoms')) {
      if (user.symptomUsage >= currentLimits.symptoms) {
        return res.status(429).json({ error: 'Symptom analysis quota exceeded', limit: currentLimits.symptoms });
      }
    }

    next();
  } catch (error) {
    console.error('API Key Auth error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

export default apiKeyAuth;
