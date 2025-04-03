import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ProfileFormData, UserData } from '../types/auth';
import config from '../config';


interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (uid: string, token: string, newPassword1: string, newPassword2: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!localStorage.getItem(config.auth.tokenStorageKey),
      hasRefreshToken: !!localStorage.getItem(config.auth.refreshTokenStorageKey)
    });
  }, [isAuthenticated, user]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      const userData = await AuthService.login({ email, password, rememberMe });
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      
      // Get the redirect path from location state or default to advertisements
      const from = (location.state as any)?.from?.pathname || '/advertisements';
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        'Invalid email or password';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // The register function handles:
  // 1. Making the API request to register the user
  // 2. Error handling and displaying error messages
  // 3. Managing the loading state
  // 4. Updating the user state after successful registration
  const register = async (data: any) => {
    try {
      setLoading(true); // Loading indicators (like spinners or loading text) will be shown and buttons will be disabled during registration
      await AuthService.register(data); // Make API request to register the user
      toast.success(
        'Registration successful! Please check your email to verify your account.',
        { duration: 5000 }
      );
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error('Registration error in context:', error);

      // If the error has a message (from our error handling in service)
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
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
      toast.success('Logged out successfully');
      navigate('/auth/login/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth/login/');
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await AuthService.verifyEmail(token);
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      toast.success('Email verified successfully');
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    await AuthService.resendVerificationEmail(email);
  };

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      
      // Check if we have a token before proceeding
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) {
        console.error("No authentication token found in localStorage");
        toast.error("Authentication error. Please log in again.");
        logout(); // Force logout and redirect to login
        throw new Error("No authentication token found");
      }
      
      const response = await AuthService.updateProfile(data);
      
      // Update user state with new data
      setUser(prev => {
        if (!prev) return response;
        return { ...prev, ...response };
      });
      
      toast.success('Profile updated successfully');
      return response;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await AuthService.requestPasswordReset(email);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async (uid: string, token: string, newPassword1: string, newPassword2: string) => {
    try {
      setLoading(true);
      await AuthService.confirmPasswordReset(uid, token, newPassword1, newPassword2);
    } catch (error) {
      console.error('Error confirming password reset:', error);
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
    setUser
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
