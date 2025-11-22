import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cattleId: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Bull', 'Cow', 'Heifer', 'Calf'],
    required: true
  },
  milkProduction: {
    type: Number,
    default: 0
  },
  disease: {
    type: String,
    default: 'None'
  },
  image: {
    type: String,
    default: ''
  },
  healthStatus: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  }
}, {
  timestamps: true
});

export default mongoose.model('Cattle', cattleSchema);