import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUtils, authAPI } from '../services/apiService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get user from localStorage
      const storedUser = apiUtils.getUser();
      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
        return;
      }

      // If no stored user, try to get current user from API
      if (apiUtils.isAuthenticated()) {
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          setUser(response.user);
          apiUtils.setUser(response.user);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setError(error.message || 'Failed to load user data');
      // Clear invalid auth data
      apiUtils.removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    apiUtils.setUser(userData);
  };

  const logout = () => {
    setUser(null);
    apiUtils.removeAuthToken();
  };

  const refreshUser = async () => {
    if (apiUtils.isAuthenticated()) {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          updateUser(response.user);
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
        logout();
      }
    }
  };

  const value = {
    user,
    loading,
    error,
    updateUser,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isClient: user?.userType === 'client',
    isProvider: user?.userType === 'provider',
    isAdmin: user?.userType === 'admin',
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
