import express from 'express';
import Cattle from '../models/Cattle.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all cattle for user
router.get('/my-cattle', auth, async (req, res) => {
  try {
    const cattle = await Cattle.find({ owner: req.userId })
      .sort({ createdAt: -1 });
    res.json(cattle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cattle' });
  }
});

// Add new cattle
router.post('/', auth, async (req, res) => {
  try {
    const cattleData = {
      ...req.body,
      owner: req.userId
    };

    const cattle = new Cattle(cattleData);
    await cattle.save();

    res.json(cattle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add cattle' });
  }
});

// Update cattle
router.put('/:id', auth, async (req, res) => {
  try {
    const cattle = await Cattle.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    res.json(cattle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cattle' });
  }
});

// Delete cattle
router.delete('/:id', auth, async (req, res) => {
  try {
    const cattle = await Cattle.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId
    });

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    res.json({ message: 'Cattle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cattle' });
  }
});

// Get cattle statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalCattle = await Cattle.countDocuments({ owner: req.userId });
    
    const healthStats = await Cattle.aggregate([
      { $match: { owner: req.userId } },
      { $group: { _id: '$healthStatus', count: { $sum: 1 } } }
    ]);

    const genderStats = await Cattle.aggregate([
      { $match: { owner: req.userId } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    res.json({
      totalCattle,
      healthStats,
      genderStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;