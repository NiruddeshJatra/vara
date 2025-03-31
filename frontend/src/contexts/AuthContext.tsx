import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import config from '../config';
import axios from 'axios';
import { RegistrationData, ProfileFormData, UserData, LoginData } from '../types/auth';

interface AuthContextType {
  currentUser: UserData | null;
  setCurrentUser: (user: UserData | null) => void;
  loading: boolean;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  login: (loginData: LoginData) => Promise<void>;
  register: (formData: RegistrationData) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
  verifyEmail: (token: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (uid: string, token: string, password1: string, password2: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // // Check if we're in development mode
    // if (config.isDevelopment) {
    //   // Create a mock user for development
    //   const mockUser: UserData = {
    //     id: '1',
    //     email: 'dev@example.com',
    //     username: 'dev_user',
    //     first_name: 'Dev',
    //     last_name: 'User',
    //     phone_number: '1234567890',
    //     location: 'Development',
    //     profile_picture: null,
    //     is_verified: true,
    //     is_trusted: true,
    //     average_rating: 5.0,
    //   };

    //   // Store the mock user in localStorage
    //   localStorage.setItem(config.auth.userStorageKey, JSON.stringify(mockUser));

    //   // Set the current user
    //   setCurrentUser(mockUser);
    //   setLoading(false);
    //   return;
    // }

    // For production, check local storage
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (loginData: LoginData) => {
    try {
      setLoading(true);
      const user = await AuthService.login(loginData);
      setCurrentUser(user);
      toast.success('Login successful!');
      navigate('/');
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
  const register = async (formData: RegistrationData) => {
    try {
      setLoading(true); // Loading indicators (like spinners or loading text) will be shown and buttons will be disabled during registration
      await AuthService.register(formData); // Make API request to register the user
      toast.success(
        'Registration successful! Please check your email to verify your account.',
        { duration: 5000 }
      );
      navigate('/verify-email');
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

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isLoggedIn = () => {
    return !!currentUser;
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await axios.post(`${config.baseUrl}${config.auth.emailVerificationEndpoint}${token}/`);
      if (response.data.is_verified) {
        // Update user's verification status in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user) {
          user.is_email_verified = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await AuthService.requestPasswordReset(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Password reset request failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmPasswordReset = async (uid: string, token: string, password1: string, password2: string) => {
    try {
      setLoading(true);
      await AuthService.confirmPasswordReset(uid, token, password1, password2);
      toast.success('Password reset successful! You can now log in with your new password.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const response = await AuthService.updateProfile(data);
      setCurrentUser(prev => ({ ...prev, ...response }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    updateProfile,
    login,
    register,
    logout,
    isLoggedIn,
    verifyEmail,
    requestPasswordReset,
    confirmPasswordReset,
    setCurrentUser
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
