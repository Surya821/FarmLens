import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    hi: { type: String, required: true }
  },
  image: String,
  severity: { type: String, required: true },
  recoveryTime: {
    en: String,
    hi: String
  },
  overview: {
    en: String,
    hi: String
  },
  symptoms: [{
    title: { en: String, hi: String },
    description: { en: String, hi: String }
  }],
  treatment: [{
    title: { en: String, hi: String },
    description: { en: String, hi: String }
  }],
  causes: [{
    title: { en: String, hi: String },
    description: { en: String, hi: String }
  }],
  prevention: [{
    title: { en: String, hi: String },
    description: { en: String, hi: String }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Disease', diseaseSchema);
