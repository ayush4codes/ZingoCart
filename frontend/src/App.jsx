import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import VendorDashboard from './pages/VendorDashboard';
import './App.css';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('catalog'); // 'catalog', 'checkout', 'dashboard'
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div>
      <Navbar 
        onCartOpen={() => setIsCartOpen(true)} 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setCurrentTab('checkout')}
      />

      {currentTab === 'catalog' && <Catalog />}
      
      {currentTab === 'checkout' && (
        <Checkout onBackToCatalog={() => setCurrentTab('catalog')} />
      )}
      
      {currentTab === 'dashboard' && <VendorDashboard />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
