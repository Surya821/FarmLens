import express from 'express';
import User from '../models/User.js';
import Cattle from '../models/Cattle.js';
import Message from '../models/Message.js';
import Payment from '../models/Payment.js';
import UsageLog from '../models/UsageLog.js';

const router = express.Router();

// Get Admin Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCattle = await Cattle.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }); // Active in last 7 days

    // Service usage (Total count from UsageLog)
    const serviceUsed = await UsageLog.countDocuments(); 

    // Revenue calculation
    const revenueStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: null,
          payout: { $sum: '$amount' }
        }
      }
    ]);

    // API Analytics Grouping
    const apiUsageTrend = await UsageLog.aggregate([
      {
        $group: {
          _id: '$endpoint',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$response_time' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalCattle,
      totalMessages,
      serviceUsed,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      monthlyRevenue: monthlyRevenue[0]?.payout || 0,
      apiUsageTrend,
      websiteStats: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      }
    });
  } catch (error) {
    console.error('Admin Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get All Users with Basic Info
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password -otp');
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const cattleCount = await Cattle.countDocuments({ owner: user._id });
      // In a real app, you'd have a logs collection for service usage
      const serviceUsage = cattleCount; 
      return {
        ...user.toObject(),
        cattleCount,
        serviceUsage
      };
    }));
    res.json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete a User
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Also delete their cattle
    await Cattle.deleteMany({ owner: req.params.id });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
