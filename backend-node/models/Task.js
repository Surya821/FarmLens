import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  time: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'fa-calendar-check'
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastCompletedDate: {
    type: String, // Stored as YYYY-MM-DD
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);
