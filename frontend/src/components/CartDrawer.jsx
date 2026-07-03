import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingCart, ArrowRight, IndianRupee } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            <ShoppingCart size={22} />
            Shopping Cart
          </h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <ShoppingCart size={48} style={{ color: 'var(--text-muted)' }} />
              <p>Your basket is empty!</p>
              <button 
                className="glow-btn" 
                onClick={onClose}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Shop Groceries
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId} className="cart-item-card">
                <img 
                  src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100"} 
                  alt={item.name} 
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100";
                  }}
                />
                
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-vendor">Store: {item.vendorName}</span>
                  <span className="cart-item-price">₹{item.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ {item.unit}</span></span>
                  
                  <div className="cart-item-controls">
                    {/* Quantity counter */}
                    <div className="qty-counter">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, 100)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, 100)} // max stock logic managed in CartContext
                      >
                        +
                      </button>
                    </div>

                    {/* Delete button */}
                    <button 
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-value" style={{ display: 'flex', alignItems: 'center' }}>
                <IndianRupee size={20} />
                {cartTotal}
              </span>
            </div>
            
            <button 
              className="glow-btn checkout-btn" 
              onClick={() => {
                onClose();
                onCheckout();
              }}
            >
              Checkout Now
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
