import React, { createContext, useState, useContext, ReactNode } from 'react';
import { API_URL } from '../services/siteContent';

interface AdminPanelContextType {
  openPanel: () => void;
  closePanel: () => void;
  isOpen: boolean;
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminPanelContext = createContext<AdminPanelContextType | undefined>(undefined);

export const AdminPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openPanel = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };

  const closePanel = () => {
    setIsOpen(false);
    logout(); // Also log out when closing
    document.body.style.overflow = 'auto';
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok && response.status !== 401) {
        console.error('Login request failed:', response.statusText);
        return false;
      }

      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      setIsAuthenticated(false);
      return false;
    }
  };


  return (
    <AdminPanelContext.Provider value={{ isOpen, openPanel, closePanel, isAuthenticated, login, logout }}>
      {children}
    </AdminPanelContext.Provider>
  );
};

export const useAdminPanel = (): AdminPanelContextType => {
  const context = useContext(AdminPanelContext);
  if (context === undefined) {
    throw new Error('useAdminPanel must be used within a AdminPanelProvider');
  }
  return context;
};
