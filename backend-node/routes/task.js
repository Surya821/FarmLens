import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for the authenticated user (with daily reset logic)
router.get('/', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset tasks that were completed on a previous day
    await Task.updateMany(
      { 
        userId: req.userId, 
        completed: true, 
        lastCompletedDate: { $ne: today } 
      },
      { 
        $set: { completed: false, lastCompletedDate: null } 
      }
    );

    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  const task = new Task({
    userId: req.userId,
    time: req.body.time,
    title: req.body.title,
    desc: req.body.desc,
    icon: req.body.icon,
    completed: req.body.completed || false
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.time != null) task.time = req.body.time;
    if (req.body.title != null) task.title = req.body.title;
    if (req.body.desc != null) task.desc = req.body.desc;
    if (req.body.icon != null) task.icon = req.body.icon;
    
    if (req.body.completed != null) {
      task.completed = req.body.completed;
      if (req.body.completed) {
        task.lastCompletedDate = new Date().toISOString().split('T')[0];
      } else {
        task.lastCompletedDate = null;
      }
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
