import mongoose from 'mongoose';

const OutletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  cuisine: {
    type: String,
    required: [true, 'Please specify cuisine type']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  bannerImage: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Please add estimated delivery time']
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Outlet = mongoose.model('Outlet', OutletSchema);
export default Outlet;
