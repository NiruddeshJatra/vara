import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ProfileUpdateData, UserData } from '../types/auth';
import config from '../config';
import { invalidateAfterProfileUpdate } from '../lib/query-invalidation';
import { queryClient } from '../lib/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<UserData>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (uid: string, token: string, newPassword1: string, newPassword2: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: any) => {
  return error?.response?.data?.detail ||
    error?.response?.data?.non_field_errors?.[0] ||
    error.message ||
    'An error occurred';
};

// Helper function to clear all auth data from storage
const clearAuthStorage = () => {
  // Clear from localStorage
  localStorage.removeItem(config.auth.tokenStorageKey);
  localStorage.removeItem(config.auth.refreshTokenStorageKey);
  localStorage.removeItem(config.auth.userStorageKey);
  
  // Clear from sessionStorage
  sessionStorage.removeItem(config.auth.tokenStorageKey);
  sessionStorage.removeItem(config.auth.refreshTokenStorageKey);
  sessionStorage.removeItem(config.auth.userStorageKey);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // This function forces a refresh of user data from the server
  const refreshUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        // Set the user data in React Query cache as well
        queryClient.setQueryData(['user', 'current'], currentUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearAuthStorage();
        // Remove user data from React Query cache
        queryClient.removeQueries({ queryKey: ['user', 'current'] });
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      setUser(null);
      setIsAuthenticated(false);
      clearAuthStorage();
      // Remove user data from React Query cache
      queryClient.removeQueries({ queryKey: ['user', 'current'] });
    } finally {
      setLoading(false);
    }
  };

  // Initial load of user data
  useEffect(() => {
    refreshUserData();
  }, []); // Run once on mount

  // Update authentication status when user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      // First clear any existing auth data
      clearAuthStorage();
      
      const userData = await AuthService.login({ email, password, rememberMe });
      setUser(userData);
      setIsAuthenticated(true);
      
      // Set user data in React Query cache
      queryClient.setQueryData(['user', 'current'], userData);
      
      toast({
        title: "Success",
        description: "Login successful!",
        variant: "default"
      });
      
      navigate('/advertisements', { replace: true });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setLoading(true);
      await AuthService.register(data);
      toast({
        title: "Registration Success",
        description: "Registration successful! Please check your email to verify your account.",
        variant: "default"
      });
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      if (error instanceof Error && error.message) {
        toast({
          title: "Registration Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Error",
          description: "Registration failed. Please try again.",
          variant: "destructive"
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      clearAuthStorage();
      
      // Clear all relevant React Query caches
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['userProducts'] });
      queryClient.removeQueries({ queryKey: ['rentals'] });
      
      toast({
        title: "Success",
        description: "Logged out successfully",
        variant: "default"
      });
      navigate('/auth/login/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
      setUser(null);
      setIsAuthenticated(false);
      clearAuthStorage();
      
      // Clear all relevant React Query caches
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['userProducts'] });
      queryClient.removeQueries({ queryKey: ['rentals'] });
      
      navigate('/auth/login/', { replace: true, state: { error: true } });
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await AuthService.verifyEmail(token);
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Set user data in React Query cache
        queryClient.setQueryData(['user', 'current'], response.user);
      }
      toast({
        title: "Success",
        description: "Email verified successfully",
        variant: "default"
      });
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    await AuthService.resendVerificationEmail(email);
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      setLoading(true);
      const response = await AuthService.updateProfile(data);
      
      if (!response) {
        throw new Error('No response received from profile update');
      }
      
      // Update user state with fresh data
      setUser(response);
      
      // Update React Query cache with fresh user data
      queryClient.setQueryData(['user', 'current'], response);
      
      // Invalidate all dependent queries using helper function
      invalidateAfterProfileUpdate();
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await AuthService.requestPasswordReset(email);
      toast({
        title: "Success",
        description: "Password reset email sent successfully",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Reset Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async (uid: string, token: string, newPassword1: string, newPassword2: string) => {
    try {
      setLoading(true);
      await AuthService.confirmPasswordReset(uid, token, newPassword1, newPassword2);
      toast({
        title: "Success",
        description: "Password reset successful",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error confirming password reset:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Reset Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    updateProfile,
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    confirmPasswordReset,
    setUser,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;