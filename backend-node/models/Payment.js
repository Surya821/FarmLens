import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'
  },
  planName: {
    type: String,
    required: true
  },
  billingCycle: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'paid' // stripe session usually returns this
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
