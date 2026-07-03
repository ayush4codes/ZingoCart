import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dns from 'dns';

import Product from './models/Product.js';
import Vendor from './models/Vendor.js';
import Order from './models/Order.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const VENDORS_FILE = path.join(DATA_DIR, 'vendors.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory cache for serverless environments where filesystem is read-only
const memoryDb = {
  products: null,
  vendors: null,
  orders: null
};

const readJSON = (filePath) => {
  const key = path.basename(filePath, '.json');
  if (process.env.VERCEL && memoryDb[key]) {
    return memoryDb[key];
  }

  let data = [];
  if (fs.existsSync(filePath)) {
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      data = [];
    }
  } else {
    if (!process.env.VERCEL) {
      try {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      } catch (e) {}
    }
  }

  if (process.env.VERCEL) {
    memoryDb[key] = data;
  }
  return data;
};

const writeJSON = (filePath, data) => {
  const key = path.basename(filePath, '.json');
  if (process.env.VERCEL) {
    memoryDb[key] = data;
    return;
  }
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing JSON database file:", err.message);
  }
};

export let useFallback = false;

export async function connectDB() {
  // Override local DNS only when running locally (not on Vercel) to bypass SRV query failures
  if (!process.env.VERCEL) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      console.warn("⚠️ DNS configuration warning:", dnsErr.message);
    }
  }

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_MONGODB_ATLAS_URI_HERE')) {
    console.warn("⚠️ MONGODB_URI not configured properly. Falling back to local JSON database.");
    useFallback = true;
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("⚡ Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error.message);
    console.warn("⚠️ Falling back to local JSON database.");
    useFallback = true;
  }
}

// Ensure default vendors exist if using JSON database
export function seedDefaultVendors() {
  if (useFallback) {
    const vendors = readJSON(VENDORS_FILE);
    if (vendors.length === 0) {
      const defaultVendors = [
        {
          _id: "60d5ec4b1f3c3b0015b6d5f1",
          name: "Rajesh Kumar",
          storeName: "Rajesh Fresh Fruits & Veg",
          email: "rajesh@zingocart.com",
          description: "Fresh daily farm vegetables and sweet organic fruits directly from Nashik.",
          phone: "9876543210",
          address: "Shop No. 12, Kranti Chowk Market, Aurangabad",
          rating: 4.8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d5f2",
          name: "Anjali Sharma",
          storeName: "Organic Staples & Spices",
          email: "anjali@zingocart.com",
          description: "Premium handpicked organic spices, masalas, high-grade basmati rice, and pure wheat flour.",
          phone: "8765432109",
          address: "C-45, Phase 2, Industrial Area, Noida",
          rating: 4.6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "60d5ec4b1f3c3b0015b6d5f3",
          name: "Verghese Dairy",
          storeName: "Pure Nectar Dairy Products",
          email: "verghese@zingocart.com",
          description: "Pure milk, ghee, fresh paneer, butter and rich curd sourced daily from local cooperatives.",
          phone: "7654321098",
          address: "G-10, Milk Cooperative Colony, Anand, Gujarat",
          rating: 4.9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      writeJSON(VENDORS_FILE, defaultVendors);

      // Seed default products
      const products = readJSON(PRODUCTS_FILE);
      if (products.length === 0) {
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
        writeJSON(PRODUCTS_FILE, defaultProducts);
      }
    }
  }
}

// VENDORS DATA ACCESS
export async function getVendors() {
  if (useFallback) {
    return readJSON(VENDORS_FILE);
  }
  return await Vendor.find().sort({ createdAt: -1 });
}

export async function getVendorById(id) {
  if (useFallback) {
    const vendors = readJSON(VENDORS_FILE);
    return vendors.find(v => v._id === id) || null;
  }
  return await Vendor.findById(id);
}

export async function createVendor(data) {
  if (useFallback) {
    const vendors = readJSON(VENDORS_FILE);
    const newVendor = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      rating: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    vendors.push(newVendor);
    writeJSON(VENDORS_FILE, vendors);
    return newVendor;
  }
  const newVendor = new Vendor(data);
  return await newVendor.save();
}

// PRODUCTS DATA ACCESS
export async function getProducts(query = {}) {
  if (useFallback) {
    let products = readJSON(PRODUCTS_FILE);
    
    if (query.category) {
      products = products.filter(p => p.category === query.category);
    }
    if (query.vendorId) {
      products = products.filter(p => p.vendorId === query.vendorId);
    }
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    if (query.minPrice) {
      products = products.filter(p => p.price >= Number(query.minPrice));
    }
    if (query.maxPrice) {
      products = products.filter(p => p.price <= Number(query.maxPrice));
    }
    
    return products;
  }

  // Live Mongoose query building
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
  if (useFallback) {
    const products = readJSON(PRODUCTS_FILE);
    const newProduct = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    writeJSON(PRODUCTS_FILE, products);
    return newProduct;
  }
  const newProduct = new Product(data);
  return await newProduct.save();
}

export async function updateProduct(id, data) {
  if (useFallback) {
    const products = readJSON(PRODUCTS_FILE);
    const idx = products.findIndex(p => p._id === id);
    if (idx === -1) throw new Error("Product not found");
    
    const updated = {
      ...products[idx],
      ...data,
      price: data.price !== undefined ? Number(data.price) : products[idx].price,
      stock: data.stock !== undefined ? Number(data.stock) : products[idx].stock,
      updatedAt: new Date().toISOString()
    };
    products[idx] = updated;
    writeJSON(PRODUCTS_FILE, products);
    return updated;
  }
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProduct(id) {
  if (useFallback) {
    const products = readJSON(PRODUCTS_FILE);
    const filtered = products.filter(p => p._id !== id);
    writeJSON(PRODUCTS_FILE, filtered);
    return { success: true };
  }
  return await Product.findByIdAndDelete(id);
}

// ORDERS DATA ACCESS
export async function getOrders(query = {}) {
  if (useFallback) {
    let orders = readJSON(ORDERS_FILE);
    
    if (query.vendorId) {
      // Return orders that contain items belonging to this vendor,
      // and map the items list to only include items for this vendor.
      orders = orders.filter(o => o.items.some(item => item.vendorId === query.vendorId));
    }
    
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const mongoQuery = {};
  if (query.vendorId) {
    mongoQuery["items.vendorId"] = query.vendorId;
  }
  return await Order.find(mongoQuery).sort({ createdAt: -1 });
}

export async function createOrder(data) {
  if (useFallback) {
    const orders = readJSON(ORDERS_FILE);
    const products = readJSON(PRODUCTS_FILE);

    // Deduct stocks in fallback mode
    data.items.forEach(item => {
      const prod = products.find(p => p._id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    writeJSON(PRODUCTS_FILE, products);

    const newOrder = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);
    return newOrder;
  }

  // Handle Mongoose stock deduction
  for (const item of data.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }

  const newOrder = new Order(data);
  return await newOrder.save();
}

export async function updateOrderItemStatus(orderId, itemId, vendorId, newStatus) {
  if (useFallback) {
    const orders = readJSON(ORDERS_FILE);
    const orderIdx = orders.findIndex(o => o._id === orderId);
    if (orderIdx === -1) throw new Error("Order not found");
    
    const order = orders[orderIdx];
    
    // Update individual item status
    let itemFound = false;
    order.items.forEach(item => {
      if (item._id === itemId || item.productId === itemId) {
        item.status = newStatus;
        itemFound = true;
      }
    });

    if (!itemFound) {
      // Find by vendorId if itemId check missed due to schema mapping
      order.items.forEach(item => {
        if (item.vendorId === vendorId && (itemId === undefined || item._id === itemId || item.productId === itemId)) {
          item.status = newStatus;
        }
      });
    }

    // Recalculate overall order status
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

    order.updatedAt = new Date().toISOString();
    orders[orderIdx] = order;
    writeJSON(ORDERS_FILE, orders);
    return order;
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // Update item
  order.items.forEach(item => {
    if (item._id.toString() === itemId || item.productId.toString() === itemId) {
      item.status = newStatus;
    }
  });

  // Re-evaluate overall order status
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
