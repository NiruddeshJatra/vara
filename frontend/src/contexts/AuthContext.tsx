import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ProfileUpdateData, UserData } from '../types/auth';
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
  updateProfile: (data: ProfileUpdateData) => Promise<UserData>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (uid: string, token: string, newPassword1: string, newPassword2: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: any) => {
  return error?.response?.data?.detail ||
    error?.response?.data?.non_field_errors?.[0] ||
    error.message ||
    'An error occurred';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AuthService.getCurrentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      const userData = await AuthService.login({ email, password, rememberMe });
      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Login successful!",
        variant: "default"
      });
      
      // Get the redirect path from location state or default to advertisements
      const from = (location.state as any)?.from?.pathname || '/advertisements';
      navigate(from, { replace: true });
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

  // The register function handles:
  // 1. Making the API request to register the user
  // 2. Error handling and displaying error messages
  // 3. Managing the loading state
  // 4. Updating the user state after successful registration
  const register = async (data: any) => {
    try {
      setLoading(true); // Loading indicators (like spinners or loading text) will be shown and buttons will be disabled during registration
      await AuthService.register(data); // Make API request to register the user
      toast({
        title: "Registration Success",
        description: "Registration successful! Please check your email to verify your account.",
        variant: "default"
      });
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      // If the error has a message (from our error handling in service)
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
      toast({
        title: "Success",
        description: "Logged out successfully",
        variant: "default"
      });
      navigate('/auth/login/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
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
      
      // Update local storage
      localStorage.setItem(config.auth.userStorageKey, JSON.stringify(response));
      
      // Update user data only if it's different
      if (JSON.stringify(user) !== JSON.stringify(response)) {
        setUser(response);
      }
      
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
