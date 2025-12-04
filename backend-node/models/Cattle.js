import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  name: {
    type: String,
    required: [true, 'Cattle name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  cattleId: {
    type: String,
    required: [true, 'Cattle ID is required'],
    unique: true,
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [30, 'Age seems too high']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative'],
    max: [2000, 'Weight seems too high']
  },
  gender: {
    type: String,
    enum: ['Bull', 'Cow', 'Heifer', 'Calf'],
    required: [true, 'Gender is required']
  },
  milkProduction: {
    type: Number,
    default: 0,
    min: [0, 'Milk production cannot be negative']
  },
  disease: {
    type: String,
    default: 'None',
    trim: true
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

// Add index for better query performance
cattleSchema.index({ owner: 1, createdAt: -1 });
cattleSchema.index({ cattleId: 1 }, { unique: true });

export default mongoose.model('Cattle', cattleSchema);