import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('zingocart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zingocart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prevItems => {
      const existingIdx = prevItems.findIndex(item => item.productId === product._id);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + qty;
        if (newQty > product.stock) {
          alert(`Cannot add more items. Only ${product.stock} items left in stock.`);
          return prevItems;
        }
        updated[existingIdx].quantity = newQty;
        return updated;
      } else {
        if (qty > product.stock) {
          alert(`Cannot add. Only ${product.stock} items left in stock.`);
          return prevItems;
        }
        return [...prevItems, {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: qty,
          unit: product.unit,
          vendorId: product.vendorId,
          vendorName: product.vendorName,
          imageUrl: product.imageUrl
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, qty, maxStock) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (qty > maxStock) {
      alert(`Only ${maxStock} items left in stock.`);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
