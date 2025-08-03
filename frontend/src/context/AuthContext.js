import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check for both regular user and admin user
    const storedUser = localStorage.getItem('user');
    const storedAdminUser = localStorage.getItem('adminUser');
    
    if (storedUser) return JSON.parse(storedUser);
    if (storedAdminUser) return JSON.parse(storedAdminUser);
    return null;
  });
  
  const [token, setToken] = useState(() => {
    // Check for both regular token and admin token
    const storedToken = localStorage.getItem('token');
    const storedAdminToken = localStorage.getItem('adminToken');
    
    return storedToken || storedAdminToken || null;
  });

  useEffect(() => {
    if (user) {
      // Store based on user role
      if (user.role === 'admin') {
        localStorage.setItem('adminUser', JSON.stringify(user));
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('adminUser');
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
    }
    
    if (token) {
      // Store based on user role
      if (user && user.role === 'admin') {
        localStorage.setItem('adminToken', token);
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', token);
        localStorage.removeItem('adminToken');
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
    }
  }, [user, token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear both sets of localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};