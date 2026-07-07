import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import VendorDashboard from './pages/VendorDashboard';
import './App.css';

function AppContent() {
  const { setRole } = useUser();
  const [path, setPath] = useState(window.location.pathname);
  const [currentTab, setCurrentTab] = useState('catalog'); // 'catalog', 'checkout'
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      setPath(currentPath);
      if (currentPath.startsWith('/vendor')) {
        setRole('vendor');
      } else {
        setRole('buyer');
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Initialize role alignment on mount
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, [setRole]);

  const isVendorRoute = path.startsWith('/vendor');

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

      {isVendorRoute ? (
        <VendorDashboard />
      ) : (
        <>
          {currentTab === 'catalog' && <Catalog />}
          {currentTab === 'checkout' && (
            <Checkout onBackToCatalog={() => setCurrentTab('catalog')} />
          )}
        </>
      )}
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
