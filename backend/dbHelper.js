import mongoose from 'mongoose';
import Product from './models/Product.js';
import Vendor from './models/Vendor.js';
import Order from './models/Order.js';

export async function connectDB() {
  if (!process.env.VERCEL) {
    try {
      const dns = await import('dns');
      dns.default.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      console.warn("⚠️ DNS configuration warning:", dnsErr.message);
    }
  }

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_MONGODB_ATLAS_URI_HERE')) {
    throw new Error("MONGODB_URI is not configured.");
  }

  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("⚡ Connected to MongoDB Atlas successfully!");
}

export async function seedDefaultVendors() {
  const count = await Vendor.countDocuments();
  if (count === 0) {
    const defaultVendors = [
      {
        _id: "60d5ec4b1f3c3b0015b6d5f1",
        name: "Rajesh Kumar",
        storeName: "Rajesh Fresh Fruits & Veg",
        email: "rajesh@zingocart.com",
        description: "Fresh daily farm vegetables and sweet organic fruits directly from Nashik.",
        phone: "9876543210",
        address: "Shop No. 12, Kranti Chowk Market, Aurangabad",
        rating: 4.8
      },
      {
        _id: "60d5ec4b1f3c3b0015b6d5f2",
        name: "Anjali Sharma",
        storeName: "Organic Staples & Spices",
        email: "anjali@zingocart.com",
        description: "Premium handpicked organic spices, masalas, high-grade basmati rice, and pure wheat flour.",
        phone: "8765432109",
        address: "C-45, Phase 2, Industrial Area, Noida",
        rating: 4.6
      },
      {
        _id: "60d5ec4b1f3c3b0015b6d5f3",
        name: "Verghese Dairy",
        storeName: "Pure Nectar Dairy Products",
        email: "verghese@zingocart.com",
        description: "Pure milk, ghee, fresh paneer, butter and rich curd sourced daily from local cooperatives.",
        phone: "7654321098",
        address: "G-10, Milk Cooperative Colony, Anand, Gujarat",
        rating: 4.9
      }
    ];
    await Vendor.insertMany(defaultVendors);

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const defaultProducts = [
        {
          _id: "60d5ec4b1f3c3b0015b6d601",
          name: "Organic Tomatoes",
          description: "Fresh, juicy, and vine-ripened organic tomatoes.",
          price: 45,
          category: "Vegetables",
          stock: 60,
          unit: "1 kg",
          imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400",
          vendorId: "60d5ec4b1f3c3b0015b6d5f1",
          vendorName: "Rajesh Fresh Fruits & Veg"
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d602",
          name: "Alphonso Mangoes",
          description: "Premium sweet Alphonso mangoes directly from Ratnagiri.",
          price: 450,
          category: "Fruits",
          stock: 25,
          unit: "1 dozen",
          imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
          vendorId: "60d5ec4b1f3c3b0015b6d5f1",
          vendorName: "Rajesh Fresh Fruits & Veg"
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d603",
          name: "Premium Basmati Rice",
          description: "Aged long-grain basmati rice with exquisite aroma.",
          price: 135,
          category: "Atta, Rice & Dal",
          stock: 120,
          unit: "1 kg",
          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
          vendorId: "60d5ec4b1f3c3b0015b6d5f2",
          vendorName: "Organic Staples & Spices"
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d604",
          name: "Pure Kashmiri Red Chilli Powder",
          description: "Gives a rich red color and mild heat to your dishes.",
          price: 90,
          category: "Spices & Masalas",
          stock: 50,
          unit: "200 g",
          imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=400",
          vendorId: "60d5ec4b1f3c3b0015b6d5f2",
          vendorName: "Organic Staples & Spices"
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d605",
          name: "Fresh Malai Paneer",
          description: "Soft, fresh, and melt-in-mouth cottage cheese made from whole milk.",
          price: 110,
          category: "Dairy & Eggs",
          stock: 40,
          unit: "200 g",
          imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400",
          vendorId: "60d5ec4b1f3c3b0015b6d5f3",
          vendorName: "Pure Nectar Dairy Products"
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d606",
          name: "Pure Cow Ghee",
          description: "Traditional danedar cow ghee with rich taste and aroma.",
          price: 680,
          category: "Dairy & Eggs",
          stock: 30,
          unit: "1 L",
          imageUrl: "https://images.unsplash.com/photo-1589733901241-5d519d6859b2?auto=format&fit=crop&q=80&w=400",
          vendorId: "60d5ec4b1f3c3b0015b6d5f3",
          vendorName: "Pure Nectar Dairy Products"
        }
      ];
      await Product.insertMany(defaultProducts);
    }
  }
}

// VENDORS DATA ACCESS
export async function getVendors() {
  return await Vendor.find().sort({ createdAt: -1 });
}

export async function getVendorById(id) {
  return await Vendor.findById(id);
}

export async function createVendor(data) {
  const newVendor = new Vendor(data);
  return await newVendor.save();
}

// PRODUCTS DATA ACCESS
export async function getProducts(query = {}) {
  const mongoQuery = {};
  if (query.category) mongoQuery.category = query.category;
  if (query.vendorId) mongoQuery.vendorId = query.vendorId;
  if (query.search) {
    mongoQuery.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }
  if (query.minPrice || query.maxPrice) {
    mongoQuery.price = {};
    if (query.minPrice) mongoQuery.price.$gte = Number(query.minPrice);
    if (query.maxPrice) mongoQuery.price.$lte = Number(query.maxPrice);
  }

  return await Product.find(mongoQuery).sort({ createdAt: -1 });
}

export async function createProduct(data) {
  const newProduct = new Product(data);
  return await newProduct.save();
}

export async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}

// ORDERS DATA ACCESS
export async function getOrders(query = {}) {
  const mongoQuery = {};
  if (query.vendorId) {
    mongoQuery["items.vendorId"] = query.vendorId;
  }
  return await Order.find(mongoQuery).sort({ createdAt: -1 });
}

export async function createOrder(data) {
  for (const item of data.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }

  const newOrder = new Order(data);
  return await newOrder.save();
}

export async function updateOrderItemStatus(orderId, itemId, vendorId, newStatus) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.items.forEach(item => {
    if (item._id.toString() === itemId || item.productId.toString() === itemId) {
      item.status = newStatus;
    }
  });

  const statuses = order.items.map(item => item.status);
  if (statuses.every(s => s === 'Delivered')) {
    order.status = 'Delivered';
  } else if (statuses.every(s => s === 'Cancelled')) {
    order.status = 'Cancelled';
  } else if (statuses.some(s => s === 'Shipped' || s === 'Delivered')) {
    order.status = 'Partially Shipped';
  } else {
    order.status = 'Pending';
  }

  return await order.save();
}
