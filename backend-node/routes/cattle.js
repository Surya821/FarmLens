import express from 'express';
import mongoose from 'mongoose';
import Cattle from '../models/Cattle.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all cattle for user
router.get('/my-cattle', auth, async (req, res) => {
  try {
    console.log('Fetching cattle for user:', req.userId);
    const cattle = await Cattle.find({ owner: req.userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${cattle.length} cattle for user ${req.userId}`);
    res.json(cattle);
  } catch (error) {
    console.error('Error fetching cattle:', error);
    res.status(500).json({ error: 'Failed to fetch cattle' });
  }
});

// Get cattle statistics — must be ABOVE /:id to avoid "stats" being matched as an ID
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('Fetching stats for user:', req.userId);
    
    const totalCattle = await Cattle.countDocuments({ owner: req.userId });
    
    // Use new mongoose.Types.ObjectId syntax
    const healthStats = await Cattle.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: '$healthStatus', count: { $sum: 1 } } }
    ]);

    const genderStats = await Cattle.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    const healthyCount = await Cattle.countDocuments({ 
      owner: req.userId, 
      healthStatus: { $in: ['Excellent', 'Good'] } 
    });

    const pendingCount = await Cattle.countDocuments({ 
      owner: req.userId, 
      healthStatus: { $in: ['Fair', 'Poor'] } 
    });

    res.json({
      totalCattle,
      healthyCount,
      pendingCount,
      healthStats,
      genderStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get single cattle by ID
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching cattle with ID:', req.params.id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cattle ID' });
    }
    
    const cattle = await Cattle.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    console.log('Cattle found:', cattle._id);
    res.json(cattle);
  } catch (error) {
    console.error('Error fetching cattle by ID:', error);
    res.status(500).json({ error: 'Failed to fetch cattle details' });
  }
});

// Add new cattle
router.post('/', auth, async (req, res) => {
  try {
    console.log('Adding new cattle for user:', req.userId);
    console.log('Cattle data:', req.body);

    // Validate required fields
    const requiredFields = ['name', 'cattleId', 'breed', 'age', 'weight', 'gender'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if cattleId already exists
    const existingCattle = await Cattle.findOne({ cattleId: req.body.cattleId });
    if (existingCattle) {
      return res.status(400).json({ error: 'Cattle ID already exists' });
    }

    const cattleData = {
      ...req.body,
      owner: req.userId
    };

    // Convert string numbers to actual numbers
    cattleData.age = parseFloat(cattleData.age);
    cattleData.weight = parseFloat(cattleData.weight);
    cattleData.milkProduction = cattleData.milkProduction ? parseFloat(cattleData.milkProduction) : 0;

    const cattle = new Cattle(cattleData);
    const savedCattle = await cattle.save();
    
    console.log('Cattle saved successfully:', savedCattle._id);
    res.status(201).json(savedCattle);
  } catch (error) {
    console.error('Error adding cattle:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Cattle ID already exists' });
    }
    
    res.status(500).json({ error: 'Failed to add cattle: ' + error.message });
  }
});

// Update cattle
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating cattle:', req.params.id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cattle ID' });
    }

    // Convert numeric fields
    const updateData = { ...req.body };
    if (updateData.age) updateData.age = parseFloat(updateData.age);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);
    if (updateData.milkProduction) updateData.milkProduction = parseFloat(updateData.milkProduction);

    const cattle = await Cattle.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    console.log('Cattle updated successfully:', cattle._id);
    res.json(cattle);
  } catch (error) {
    console.error('Error updating cattle:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Cattle ID already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update cattle' });
  }
});

// Delete cattle
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting cattle:', req.params.id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid cattle ID' });
    }

    const cattle = await Cattle.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId
    });

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    console.log('Cattle deleted successfully:', cattle._id);
    res.json({ message: 'Cattle deleted successfully' });
  } catch (error) {
    console.error('Error deleting cattle:', error);
    res.status(500).json({ error: 'Failed to delete cattle' });
  }
});

// (stats route moved above /:id — see top of file)

export default router;