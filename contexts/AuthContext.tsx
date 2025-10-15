'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { profileAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Kiểm tra token khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('accessToken');
      console.log('AuthContext: Checking authentication, token exists:', !!token);
      
      if (token) {
        try {
          console.log('AuthContext: Loading user profile from API...');
          // Gọi API để lấy thông tin user mới nhất
          const response = await axiosInstance.get('/api/profile');
          console.log('AuthContext: API response:', response.data);
          
          // API trả về { user: {...} }, cần extract user object
          const userData = response.data.user || response.data;
          console.log('AuthContext: User profile loaded:', userData);
          setUser(userData);
          
          // Cập nhật localStorage với thông tin user mới nhất
          localStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // Nếu API fail, fallback về localStorage
          const userData = localStorage.getItem('userData');
          if (userData) {
            console.log('AuthContext: Fallback to localStorage user data');
            setUser(JSON.parse(userData));
          } else {
            console.log('AuthContext: No user data found, clearing tokens');
            // Nếu không có userData, xóa token
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
          }
        }
      } else {
        console.log('AuthContext: No token found, user not authenticated');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data;
      
      // Lưu token và user data vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data;
      
      // Lưu token và user data vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout để invalidate refresh token
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await axiosInstance.post('/api/auth/logout', { refreshToken });
        }
      }
    } catch (error) {
      // Không quan trọng nếu API logout fail
      console.error('Logout API failed:', error);
    } finally {
      // Xóa tất cả data khỏi localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
