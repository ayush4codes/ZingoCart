import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'Indian Grocery Vendor offering fresh and high-quality items.',
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  }
}, { timestamps: true });

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
export default Vendor;
