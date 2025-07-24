
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { API_URL } from '../services/siteContent';

interface LoginResult {
  success: boolean;
  message?: string;
}

interface AdminPanelContextType {
  openPanel: () => void;
  closePanel: () => void;
  isOpen: boolean;
  isAuthenticated: boolean;
  login: (password: string) => Promise<LoginResult>;
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

  const login = async (password: string): Promise<LoginResult> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json(); // Always try to parse JSON body

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setIsAuthenticated(false);
        // Use the message from the API if available, for both 401 and 500 errors
        return { success: false, message: data.message || 'An unknown error occurred.' };
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      setIsAuthenticated(false);
      // This is for network errors etc. where we can't parse JSON
      return { success: false, message: 'Could not connect to the authentication server.' };
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
