import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('buyer'); // 'buyer' or 'vendor'
  const [vendors, setVendors] = useState([]);
  const [activeVendor, setActiveVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vendors');
      const data = await res.json();
      setVendors(data);
      if (data.length > 0 && !activeVendor) {
        setActiveVendor(data[0]); // default to first vendor
      } else if (data.length > 0 && activeVendor) {
        // Keep active vendor sync'd if details updated
        const updatedActive = data.find(v => v._id === activeVendor._id);
        if (updatedActive) setActiveVendor(updatedActive);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const selectVendor = (vendorId) => {
    const v = vendors.find(item => item._id === vendorId);
    if (v) {
      setActiveVendor(v);
    }
  };

  const registerVendor = async (vendorData) => {
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to register vendor");
      }
      const newVendor = await res.json();
      await fetchVendors();
      setActiveVendor(newVendor);
      return newVendor;
    } catch (error) {
      console.error("Error registering vendor:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      role,
      setRole,
      vendors,
      activeVendor,
      setActiveVendor,
      selectVendor,
      registerVendor,
      loading,
      refreshVendors: fetchVendors
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
