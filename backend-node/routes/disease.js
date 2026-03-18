import express from 'express';
import Disease from '../models/Disease.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Get all diseases
router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find().sort({ createdAt: -1 });
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

// Add a new disease
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    let payload;
    if (req.body.data) {
      payload = JSON.parse(req.body.data);
    } else {
      payload = req.body;
    }

    if (req.file) {
      payload.image = req.file.path;
    }
    const newDisease = new Disease(payload);
    await newDisease.save();
    res.status(201).json(newDisease);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add disease', details: error.message });
  }
});

// Update a disease
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    let payload;
    if (req.body.data) {
      payload = JSON.parse(req.body.data);
    } else {
      payload = req.body;
    }
    if (req.file) {
      payload.image = req.file.path;
    }
    const disease = await Disease.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json(disease);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update disease', details: error.message });
  }
});

// Delete a disease
router.delete('/:id', async (req, res) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json({ success: true, message: 'Disease deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete disease' });
  }
});

export default router;
