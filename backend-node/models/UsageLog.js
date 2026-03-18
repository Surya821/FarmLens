import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  apiKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    index: true
  },
  endpoint: {
    type: String, // e.g., '/api/v1/predict/breed'
    required: true,
    index: true
  },
  method: {
    type: String,
    default: 'POST'
  },
  status: {
    type: Number, // 200, 403, 429
    required: true
  },
  response_time: {
    type: Number, // in ms
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('UsageLog', usageLogSchema);
