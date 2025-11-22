import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: ''
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);