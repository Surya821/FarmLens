import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  keyHash: {
    type: String,
    required: true,
    unique: true
  },
  keyHint: {
    type: String, // e.g. "fl_...abcd"
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('ApiKey', apiKeySchema);
