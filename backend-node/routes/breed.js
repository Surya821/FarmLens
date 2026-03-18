import express from 'express';
import Breed from '../models/Breed.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Get all dynamic breeds
router.get('/', async (req, res) => {
  try {
    const breeds = await Breed.find().sort({ createdAt: -1 });
    res.json(breeds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch breeds' });
  }
});

// Add a new breed with optional Cloudinary image upload
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
    const newBreed = new Breed(payload);
    await newBreed.save();
    res.status(201).json(newBreed);
  } catch (error) {
    // console.error('Failed to add breed:', error);
    res.status(500).json({ error: 'Failed to add breed', details: error.message });
  }
});

// Update a breed
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
    const breed = await Breed.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!breed) return res.status(404).json({ error: 'Breed not found' });
    res.json(breed);
  } catch (error) {
    console.error('Failed to update breed:', error);
    res.status(500).json({ error: 'Failed to update breed', details: error.message });
  }
});

// Delete a breed
router.delete('/:id', async (req, res) => {
  try {
    const breed = await Breed.findByIdAndDelete(req.params.id);
    if (!breed) return res.status(404).json({ error: 'Breed not found' });
    res.json({ success: true, message: 'Breed deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete breed' });
  }
});

export default router;

