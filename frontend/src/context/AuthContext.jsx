import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          setIsAdmin(response.data.data.role === 'admin');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAdmin(response.data.user.role === 'admin');
      return true;
    } catch (error) {
      return false;
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAdmin(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      login, 
      adminLogin, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
