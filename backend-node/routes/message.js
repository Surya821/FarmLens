import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Send message (public)
router.post('/', async (req, res) => {
  try {
    const { email, content } = req.body;
    if (!email || !content) {
      return res.status(400).json({ error: 'Email and content are required' });
    }
    const newMessage = new Message({ email, content });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Admin: Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Admin: Mark message as read (POST to avoid CORS PATCH preflight issues)
router.post('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Admin: Mark message as read (PATCH - works after server restart with updated CORS)
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Admin: Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
