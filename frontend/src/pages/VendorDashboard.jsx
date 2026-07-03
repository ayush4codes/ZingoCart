import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
  Plus, Edit, Trash2, IndianRupee, ShoppingBag, 
  Package, AlertTriangle, Check, X, RefreshCw, PlusCircle
} from 'lucide-react';

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Atta, Rice & Dal',
  'Spices & Masalas',
  'Snacks & Sweets',
  'Beverages',
  'Other'
];

const VendorDashboard = () => {
  const { activeVendor, vendors, refreshVendors, registerVendor } = useUser();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'register'
  
  // Dashboard Stats
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStock: 0
  });

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Modals / Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  
  // Product Form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Vegetables',
    stock: '',
    unit: '1 kg',
    imageUrl: ''
  });

  // Vendor Registration Form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  // Fetch Dashboard Stats and Products
  const fetchProductsAndStats = async () => {
    if (!activeVendor) return;
    try {
      setLoadingProducts(true);
      const res = await fetch(`/api/products?vendorId=${activeVendor._id}`);
      const data = await res.json();
      setProducts(data);

      // Low stock count
      const lowStockCount = data.filter(p => p.stock <= 5).length;
      setStats(prev => ({
        ...prev,
        totalProducts: data.length,
        lowStock: lowStockCount
      }));
    } catch (err) {
      console.error("Error fetching vendor products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    if (!activeVendor) return;
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/orders?vendorId=${activeVendor._id}`);
      const data = await res.json();
      setOrders(data);

      // Calculate vendor metrics: total orders and total revenue from delivered items
      const vendorOrdersCount = data.length;
      let revenueSum = 0;
      data.forEach(order => {
        order.items.forEach(item => {
          if (item.vendorId === activeVendor._id && item.status === 'Delivered') {
            revenueSum += item.price * item.quantity;
          }
        });
      });

      setStats(prev => ({
        ...prev,
        revenue: revenueSum,
        totalOrders: vendorOrdersCount
      }));
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProductsAndStats();
    fetchOrders();
  }, [activeVendor]);

  // Handle Add/Edit Product Submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!activeVendor) return;

    const payload = {
      ...productForm,
      vendorId: activeVendor._id,
      vendorName: activeVendor.storeName,
      price: Number(productForm.price),
      stock: Number(productForm.stock)
    };

    try {
      let res;
      if (editProduct) {
        // Edit Product
        res = await fetch(`/api/products/${editProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add Product
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error("Failed to save product");
      
      setShowProductModal(false);
      setEditProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'Vegetables',
        stock: '',
        unit: '1 kg',
        imageUrl: ''
      });
      fetchProductsAndStats();
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setEditProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit,
      imageUrl: product.imageUrl || ''
    });
    setShowProductModal(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProductsAndStats();
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  // Update Item fulfillment Status
  const handleItemStatusChange = async (orderId, itemId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          vendorId: activeVendor._id
        })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchOrders(); // reload
    } catch (err) {
      alert("Error updating order status: " + err.message);
    }
  };

  // Handle new Vendor registration
  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerVendor(vendorForm);
      alert("Store successfully registered! You are now logged into your store.");
      setVendorForm({
        name: '',
        storeName: '',
        email: '',
        phone: '',
        address: '',
        description: ''
      });
      setActiveTab('products'); // return to dashboard
    } catch (err) {
      alert("Error registering vendor: " + err.message);
    }
  };

  if (!activeVendor && activeTab !== 'register') {
    return (
      <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>
        <h2>No Active Vendor Store Registered</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
          Get started by registering your own Indian Grocery store.
        </p>
        <button className="glow-btn" onClick={() => setActiveTab('register')}>
          <PlusCircle size={18} />
          Register New Store
        </button>
      </div>
    );
  }

  return (
    <div className="container dashboard-layout">
      {/* Dashboard Top Header */}
      {activeTab !== 'register' && (
        <div className="dashboard-header">
          <div className="vendor-info-card">
            <div className="vendor-details">
              <h1>{activeVendor.storeName}</h1>
              <p>{activeVendor.description} | {activeVendor.address}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="glow-btn" onClick={() => {
              setEditProduct(null);
              setProductForm({
                name: '',
                description: '',
                price: '',
                category: 'Vegetables',
                stock: '',
                unit: '1 kg',
                imageUrl: ''
              });
              setShowProductModal(true);
            }}>
              <Plus size={18} />
              Add Product
            </button>

            <button 
              className="cancel-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                fetchProductsAndStats();
                fetchOrders();
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      {activeTab !== 'register' && (
        <div className="dashboard-stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-label">Total Earnings (Delivered)</div>
            <div className="stat-value" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={24} style={{ marginRight: '2px' }} />
              {stats.revenue.toLocaleString('en-IN')}
            </div>
            <div className="stat-sub">Paid directly from ZingoCart</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={24} style={{ color: 'var(--accent)' }} />
              {stats.totalOrders}
            </div>
            <div className="stat-sub">Containing your store's items</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-label">Active Products</div>
            <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={24} style={{ color: '#3b82f6' }} />
              {stats.totalProducts}
            </div>
            <div className="stat-sub">Live in ZingoCart Marketplace</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-label">Low Stock Alerts</div>
            <div className="stat-value" style={{ color: stats.lowStock > 0 ? 'var(--danger)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={24} />
              {stats.lowStock}
            </div>
            <div className="stat-sub">Products with stock &le; 5 units</div>
          </div>
        </div>
      )}

      {/* Dashboard Tabs navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Vendor Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register New Store
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div>
          <div className="section-header">
            <h2>Product Catalog Manager</h2>
          </div>

          {loadingProducts ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading catalog items...</p>
          ) : products.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't listed any products yet.</p>
              <button className="glow-btn" onClick={() => setShowProductModal(true)}>
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="glass-card products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod._id}>
                      <td>
                        <div className="product-row-info">
                          <img 
                            src={prod.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100"} 
                            alt={prod.name} 
                            className="product-table-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100";
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{prod.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit: {prod.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.9rem' }}>{prod.category}</td>
                      <td style={{ fontWeight: 700 }}>₹{prod.price}</td>
                      <td>
                        <span className={`badge-stock ${prod.stock === 0 ? 'out' : prod.stock <= 5 ? 'low' : 'in'}`}>
                          {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-icon-btn" 
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="action-icon-btn delete"
                          onClick={() => handleDeleteProduct(prod._id)}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div>
          <div className="section-header">
            <h2>Order Fulfillment Board</h2>
          </div>

          {loadingOrders ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading buyer orders...</p>
          ) : orders.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No orders received yet. Items will show up here when customers purchase items from your store.
            </div>
          ) : (
            <div className="orders-list-wrapper">
              {orders.map(order => {
                // Filter down items in this order that belong to active vendor
                const vendorItems = order.items.filter(item => item.vendorId === activeVendor._id);
                const orderTotalForVendor = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                return (
                  <div key={order._id} className="glass-card order-dashboard-card">
                    <div className="order-db-header">
                      <div>
                        <span className="order-db-title">Order ID: #{order._id.slice(-8).toUpperCase()}</span>
                        <div className="order-db-date">
                          Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fulfillment Status:</span>
                        <span className={`badge-status ${order.status}`}>{order.status}</span>
                      </div>
                    </div>

                    <div className="order-db-body">
                      {/* Left: vendor items detail */}
                      <div>
                        <div className="customer-detail-title">Your Order Items</div>
                        <div className="order-items-table">
                          {vendorItems.map(item => (
                            <div key={item._id || item.productId} className="order-item-row">
                              <div>
                                <span style={{ fontWeight: 600 }}>{item.name}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>
                                  ({item.unit}) &times; {item.quantity}
                                </span>
                              </div>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                                
                                {/* Status update selector for specific vendor item */}
                                <select
                                  className="status-select"
                                  value={item.status}
                                  onChange={(e) => handleItemStatusChange(order._id, item._id || item.productId, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontWeight: 700 }}>
                          <span>Your Share Total:</span>
                          <span style={{ color: 'var(--primary)' }}>₹{orderTotalForVendor}</span>
                        </div>
                      </div>

                      {/* Right: customer info */}
                      <div className="order-customer-details">
                        <div className="customer-detail-title">Customer Shipping Info</div>
                        <div className="customer-info-line"><strong>Name:</strong> {order.customerInfo.name}</div>
                        <div className="customer-info-line"><strong>Phone:</strong> {order.customerInfo.phone}</div>
                        <div className="customer-info-line"><strong>Email:</strong> {order.customerInfo.email}</div>
                        <div className="customer-info-line" style={{ marginTop: '8px', lineHeight: '1.4' }}>
                          <strong>Address:</strong><br />
                          {order.customerInfo.address}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: REGISTER STORE */}
      {activeTab === 'register' && (
        <div className="glass-card" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle style={{ color: 'var(--primary)' }} />
            Register Your Store
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
            List your grocery products on ZingoCart and connect with thousands of local buyers.
          </p>

          <form onSubmit={handleVendorSubmit}>
            <div className="form-group">
              <label className="form-label">Vendor Store Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Verma Fresh Organic Dairy"
                required
                value={vendorForm.storeName}
                onChange={(e) => setVendorForm({...vendorForm, storeName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Owner Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Ramesh Verma"
                required
                value={vendorForm.name}
                onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@store.com"
                  required
                  value={vendorForm.email}
                  onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="e.g. 9876543210"
                  required
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Store Description</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Describe your fresh groceries or organic specialties..."
                required
                value={vendorForm.description}
                onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Store Address</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Shop number, Market name, City, State"
                required
                value={vendorForm.address}
                onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
              />
            </div>

            <button type="submit" className="glow-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
              Launch Store
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT ADD/EDIT DIALOG MODAL */}
      {showProductModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3>{editProduct ? 'Edit Grocery Product' : 'Add New Grocery Product'}</h3>
              <button className="cart-close-btn" onClick={() => setShowProductModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Fresh Cauliflower" 
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-control"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 60" 
                    required
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity Unit</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 1 kg, 500 g, 1 packet" 
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Available Stock</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 50" 
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Product Image URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://images.unsplash.com/... (optional)" 
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Organic, clean, washed and sourced fresh daily..."
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="glow-btn">
                  {editProduct ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
