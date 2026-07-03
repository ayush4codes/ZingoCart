import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  connectDB, 
  seedDefaultVendors, 
  getVendors, 
  getVendorById, 
  createVendor, 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getOrders, 
  createOrder, 
  updateOrderItemStatus 
} from './dbHelper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database connection asynchronously (non-blocking)
connectDB().then(() => {
  seedDefaultVendors();
}).catch(err => {
  console.error("Database connection initialization failed:", err);
});

// Root route
app.get('/', (req, res) => {
  res.send('ZingoCart Multi-Vendor Grocery Marketplace API is running...');
});

// VENDORS ROUTES
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await getVendors();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  try {
    const vendor = await getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const newVendor = await createVendor(req.body);
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PRODUCTS ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      vendorId: req.query.vendorId,
      search: req.query.search,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };
    const products = await getProducts(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ORDERS ROUTES
app.get('/api/orders', async (req, res) => {
  try {
    const query = {};
    if (req.query.vendorId) {
      query.vendorId = req.query.vendorId;
    }
    const orders = await getOrders(query);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/orders/:orderId/items/:itemId', async (req, res) => {
  try {
    const { status, vendorId } = req.body;
    const updatedOrder = await updateOrderItemStatus(req.params.orderId, req.params.itemId, vendorId, status);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ZingoCart Server running on http://localhost:${PORT}`);
  });
}

export default app;
