import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, CheckCircle, IndianRupee, Loader2 } from 'lucide-react';

const Checkout = ({ onBackToCatalog }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    try {
      setLoading(true);
      const payload = {
        items: cartItems,
        totalAmount: cartTotal,
        customerInfo: customer
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to place order");

      const orderData = await res.json();
      setCreatedOrder(orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      alert("Error placing order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && createdOrder) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <div className="glass-card success-screen" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="success-icon-wrapper">
            <CheckCircle size={44} />
          </div>
          <h1 className="success-title">Order Placed!</h1>
          <p className="success-text">
            Thank you for shopping at ZingoCart. Your order has been registered successfully.
          </p>
          
          <div className="glass-card" style={{ padding: '16px 24px', width: '100%', marginBottom: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ marginBottom: '8px' }}><strong>Order Number:</strong> #{createdOrder._id.slice(-8).toUpperCase()}</div>
            <div style={{ marginBottom: '8px' }}><strong>Total Charged:</strong> ₹{createdOrder.totalAmount}</div>
            <div style={{ marginBottom: '8px' }}><strong>Delivery Mode:</strong> Cash on Delivery (COD)</div>
            <div><strong>Shipping to:</strong> {createdOrder.customerInfo.address}</div>
          </div>

          <button className="glow-btn" onClick={onBackToCatalog}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className="cancel-btn" 
        onClick={onBackToCatalog}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '24px', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        Back to Store
      </button>

      <div className="checkout-layout">
        {/* Left: Customer Info Form */}
        <div className="glass-card checkout-form-section">
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ayush Mishra"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. ayush@example.com"
                required
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="e.g. 9876543210"
                required
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Flat/House No., Street address, Colony/Area, Landmark, City, State"
                required
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <div className="glass-card" style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem' }}>Payment Mode:</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Cash on Delivery (COD) is currently active. Pay securely in cash or via UPI at your doorstep.
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              className="glow-btn checkout-btn"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} />
                  Processing Order...
                </>
              ) : (
                `Confirm Order (COD)`
              )}
            </button>
          </form>
        </div>

        {/* Right: Cart Summary Panel */}
        <div className="glass-card checkout-summary-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <ShoppingBag size={20} />
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Your cart is empty.</p>
          ) : (
            <>
              <div className="checkout-summary-list">
                {cartItems.map(item => (
                  <div key={item.productId} className="checkout-item-row">
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-vendor">Vendor: {item.vendorName}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="checkout-item-price">
                        ₹{item.price} &times; {item.quantity}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-divider" />

              <div className="cart-summary-row" style={{ marginBottom: '8px' }}>
                <span className="cart-total-label">Delivery Charges</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FREE Delivery</span>
              </div>

              <div className="cart-summary-row" style={{ marginBottom: '0' }}>
                <span className="cart-total-label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Amount</span>
                <span className="cart-total-value" style={{ display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={20} />
                  {cartTotal}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
