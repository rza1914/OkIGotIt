import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email_or_phone: string;
  password: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthOpen: boolean;
  activeTab: 'login' | 'register';
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setActiveTab: (tab: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setToken(storedToken);
      // Try to get user info
      apiClient.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch((error) => {
          // Token might be invalid, clear it
          console.log('Token validation failed (expected if not logged in):', error.status);
          localStorage.removeItem('auth_token');
          setToken(null);
          apiClient.clearToken();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials);
      setToken(response.access_token);
      
      // Get user data after login
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setIsAuthOpen(false);
      
      console.log('[LOGIN OK] navigating to /dashboard');
      // Note: We don't navigate here, let the user click dashboard manually
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.register(data);
      
      // Only proceed if registration was successful
      if (response.access_token) {
        setToken(response.access_token);
        apiClient.setToken(response.access_token);
        
        try {
          // Get user data after successful registration
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
          setIsAuthOpen(false);
        } catch (userError) {
          // If getting user data fails, clear the token but don't fail registration
          console.warn('Registration successful but failed to get user data:', userError);
          setToken(response.access_token);
          setIsAuthOpen(false);
        }
      }
    } catch (error) {
      // Don't try to get user data if registration failed
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    apiClient.clearToken();
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setActiveTab(tab);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const value = {
    user,
    token,
    isAuthOpen,
    activeTab,
    isLoading,
    login,
    register,
    logout,
    openAuthModal,
    closeAuthModal,
    setActiveTab,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};