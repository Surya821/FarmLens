import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      refreshUser(); // Refresh with latest data on load
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        updateUser(data);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const incrementUsage = async (type) => {
    if (!user) return true; // Allow for guest usage? No, only for logged in as per request maybe? User saysperson takes the premium.
    
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE}/api/user/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Limit reached');
      }

      // Update local state and storage
      const updatedUser = { ...user, aiUsage: data.aiUsage, symptomUsage: data.symptomUsage };
      updateUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Usage limit error:", error);
      throw error;
    }
  };

  const getUsageLimit = (type) => {
    const limits = {
      Free: { ai: 10, symptoms: 50 },
      Pro: { ai: 100, symptoms: 500 },
      Enterprise: { ai: Infinity, symptoms: Infinity }
    };
    return limits[user?.membership || 'Free'][type === 'ai' ? 'ai' : 'symptoms'];
  };

  const triggerLimitModal = (isOpen = true) => setShowLimitModal(isOpen);

  const value = {
    user,
    login,
    logout,
    updateUser,
    refreshUser,
    incrementUsage,
    getUsageLimit,
    showLimitModal,
    triggerLimitModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}