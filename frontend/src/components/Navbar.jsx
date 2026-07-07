import React from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Store, User, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = ({ onCartOpen, currentTab, setCurrentTab }) => {
  const { role, vendors, activeVendor, selectVendor } = useUser();
  const { cartCount } = useCart();

  const handleLogoClick = () => {
    if (role === 'vendor') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      setCurrentTab('catalog');
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand/Logo */}
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
          <img src={logo} alt="ZingoCart Logo" className="logo-img" />
          <div className="brand-text-container">
            <span className="brand-name">ZINGOCART</span>
            <span className="brand-tagline">Your Indian Grocery Hub</span>
          </div>
        </div>
        <div className="nav-actions">
          {role === 'buyer' ? (
            <>
              <button 
                className="role-btn"
                onClick={() => {
                  window.history.pushState({}, '', '/vendor');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                <Store size={16} />
                Vendor Portal
              </button>
              <button className="cart-trigger" onClick={onCartOpen} title="Open Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </>
          ) : (
            <>
              <button 
                className="role-btn"
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                <User size={16} />
                Buyer View
              </button>
              {vendors.length > 0 && (
                <div className="vendor-selector-inline">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Simulating:</span>
                  <select 
                    className="vendor-select"
                    style={{ width: '200px', padding: '6px 12px', fontSize: '0.85rem' }}
                    value={activeVendor ? activeVendor._id : ''}
                    onChange={(e) => selectVendor(e.target.value)}
                  >
                    {vendors.map(v => (
                      <option key={v._id} value={v._id}>
                        {v.storeName} ({v.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
