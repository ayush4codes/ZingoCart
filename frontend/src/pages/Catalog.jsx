import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Search, SlidersHorizontal, ShoppingCart, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Atta, Rice & Dal',
  'Spices & Masalas',
  'Snacks & Sweets',
  'Beverages'
];

const Catalog = () => {
  const { addToCart } = useCart();
  const { vendors } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedVendor, setSelectedVendor] = useState('All');

  // Debounced search / filter triggers
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = new URL('http://localhost:5000/api/products');
        
        if (selectedCategory !== 'All') {
          url.searchParams.append('category', selectedCategory);
        }
        if (selectedVendor !== 'All') {
          url.searchParams.append('vendorId', selectedVendor);
        }
        if (search.trim() !== '') {
          url.searchParams.append('search', search);
        }
        url.searchParams.append('maxPrice', maxPrice.toString());

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory, maxPrice, selectedVendor]);

  return (
    <div className="container">
      {/* Category Horizontal Quick Scroller */}
      <div style={{ marginTop: '24px' }}>
        <div className="category-header-scroller">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className="glass-card filters-sidebar">
          <h2 className="filter-title" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            <SlidersHorizontal size={18} />
            Filters
          </h2>

          {/* Search bar */}
          <div className="filter-section">
            <label className="form-label">Search Products</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search tomato, ghee, basmati..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} className="search-icon" />
            </div>
          </div>

          {/* Price Range filter */}
          <div className="filter-section">
            <div className="price-range-wrapper">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Max Price</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{maxPrice}</span>
              </label>
              <input
                type="range"
                className="price-slider"
                min="20"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price-values">
                <span>₹20</span>
                <span>₹1000</span>
              </div>
            </div>
          </div>

          {/* Vendor Filter */}
          <div className="filter-section">
            <label className="form-label">Filter by Vendor</label>
            <select
              className="vendor-select"
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
            >
              <option value="All">All Vendors</option>
              {vendors.map(v => (
                <option key={v._id} value={v._id}>{v.storeName}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="products-container">
          <div className="catalog-header">
            <h1 className="catalog-title">
              {selectedCategory === 'All' ? 'All Groceries' : selectedCategory}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '12px' }}>
                ({products.length} items found)
              </span>
            </h1>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
              <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading fresh items...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No products found matching your filter criteria. Try expanding your filters or search terms.
            </div>
          ) : (
            <div className="product-grid">
              {products.map(prod => (
                <div key={prod._id} className="glass-card product-card">
                  <div className="product-image-container">
                    <img 
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                      alt={prod.name} 
                      className="product-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                    <span className="product-category-tag">{prod.category}</span>
                    <span className="product-vendor-tag">{prod.vendorName}</span>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{prod.name}</h3>
                    <p className="product-description">{prod.description}</p>
                    
                    <div className="product-footer">
                      <div className="price-box">
                        <span className="product-price">₹{prod.price}</span>
                        <span className="product-unit">per {prod.unit}</span>
                      </div>

                      {prod.stock > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <button 
                            className="add-cart-btn"
                            onClick={() => addToCart(prod, 1)}
                            title="Add to Cart"
                          >
                            <ShoppingCart size={16} style={{ marginRight: '6px' }} />
                            Add
                          </button>
                          {prod.stock <= 5 && (
                            <span className="stock-warning">Only {prod.stock} left!</span>
                          )}
                        </div>
                      ) : (
                        <button className="out-of-stock-btn" disabled>
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
