import mongoose from 'mongoose';

const breedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: String,
  description: {
    en: String,
    hi: String
  },
  characteristics: {
    en: [String],
    hi: [String]
  },
  careRequirements: [{
    title: { en: String, hi: String },
    description: { en: String, hi: String }
  }],
  healthConsiderations: [{
    title: { en: String, hi: String },
    description: { en: String, hi: String }
  }],
  origin: {
    en: String,
    hi: String
  },
  weight: {
    en: String,
    hi: String
  },
  milkProduction: {
    en: String,
    hi: String
  },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Breed', breedSchema);

