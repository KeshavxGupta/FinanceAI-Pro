import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (accessToken && refreshToken) {
        if (authService.isAuthenticated()) {
          // Token is valid, get user profile
          const userData = await authService.getProfile(accessToken);
          setUser(userData);
        } else {
          // Token expired, try to refresh
          const refreshed = await refreshTokens();
          if (!refreshed) {
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: userData, tokens } = await authService.login(email, password);
      
      // Store tokens
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      setUser(userData);
      toast.success(`Welcome back, ${userData.first_name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const { user: newUser, tokens } = await authService.register(userData);
      
      // Store tokens
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      setUser(newUser);
      toast.success(`Welcome to FinanceAI Pro, ${newUser.first_name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) return false;

      const { access } = await authService.refreshToken(refreshToken);
      localStorage.setItem('access_token', access);
      
      // Get updated user data
      const userData = await authService.getProfile(access);
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      await authService.changePassword(oldPassword, newPassword, accessToken);
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const result = await authService.forgotPassword(email);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken: refreshTokens,
        changePassword,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};