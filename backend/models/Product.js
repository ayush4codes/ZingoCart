import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true, // in ₹
  },
  category: {
    type: String,
    required: true,
    enum: ['Vegetables', 'Fruits', 'Dairy & Eggs', 'Atta, Rice & Dal', 'Spices & Masalas', 'Snacks & Sweets', 'Beverages', 'Other'],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true, // e.g. '1 kg', '500 g', '1 L', '1 pc'
  },
  imageUrl: {
    type: String,
    default: '',
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
