import express from 'express';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import apiKeyAuth from '../middleware/apiKeyAuth.js';
import UsageLog from '../models/UsageLog.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Memory storage for temporary file handling during the proxy
const upload = multer({ storage: multer.memoryStorage() });

const PY_API_URL = process.env.VITE_PY_API_URL || 'http://localhost:8000';

// --- Metadata Route ---
// Publicly accessible metadata
router.get('/metadata', (req, res) => {
  try {
    const metadataPath = path.join(__dirname, '../data/metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Metadata not available' });
  }
});

// Global usage Logger function
const logUsage = async (userId, apiKeyId, endpoint, status, duration) => {
  try {
    const log = new UsageLog({
      user: userId,
      apiKey: apiKeyId,
      endpoint,
      status,
      response_time: duration
    });
    await log.save();

    // Increment user usage if successful
    if (status === 200) {
      const field = endpoint.includes('/symptoms') ? 'symptomUsage' : 'aiUsage';
      await User.findByIdAndUpdate(userId, { $inc: { [field]: 1 } });
    }
  } catch (error) {
    console.error('Usage logging error:', error);
  }
};

// --- Breed Prediction ---
// Use multer as middleware to get the 'file' field
router.post('/predict/breed', apiKeyAuth, upload.single('file'), async (req, res) => {
  const start = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Expected multipart/form-data with "file" field.' });
    }

    // Rebuild FormData to send to Python Server
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post(`${PY_API_URL}/predict`, form, {
      headers: { 
        ...form.getHeaders()
      }
    });

    logUsage(req.userId, req.apiKeyId, '/predict/breed', 200, Date.now() - start);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    logUsage(req.userId, req.apiKeyId, '/predict/breed', status, Date.now() - start);
    res.status(status).json(error.response?.data || { error: 'Prediction server error' });
  }
});

// --- Skin Disease Prediction ---
router.post('/predict/skin', apiKeyAuth, upload.single('file'), async (req, res) => {
  const start = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Expected multipart/form-data with "file" field.' });
    }

    // Rebuild FormData to send to Python Server
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post(`${PY_API_URL}/predict-skin`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    logUsage(req.userId, req.apiKeyId, '/predict/skin', 200, Date.now() - start);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    logUsage(req.userId, req.apiKeyId, '/predict/skin', status, Date.now() - start);
    res.status(status).json(error.response?.data || { error: 'Prediction server error' });
  }
});

// --- Symptom-based Diagnosis ---
router.post('/predict/symptoms', apiKeyAuth, async (req, res) => {
  const start = Date.now();
  try {
    const response = await axios.post(`${PY_API_URL}/disease`, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });

    logUsage(req.userId, req.apiKeyId, '/predict/symptoms', 200, Date.now() - start);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    logUsage(req.userId, req.apiKeyId, '/predict/symptoms', status, Date.now() - start);
    res.status(status).json(error.response?.data || { error: 'Diagnosis server error' });
  }
});

export default router;
