import axios from 'axios';
import config from '../config';
import { toast } from '@/components/ui/use-toast';
import { RegistrationData, ProfileUpdateData, LoginData, UserData } from '../types/auth';

// Create a separate axios instance for auth endpoints (which don't use the /api prefix)
const authApi = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate axios instance for API endpoints (which use the /api prefix)
const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to consistently manage storage
const storage = {
  getToken: () => localStorage.getItem(config.auth.tokenStorageKey),
  setToken: (token: string) => localStorage.setItem(config.auth.tokenStorageKey, token),
  getRefreshToken: () => localStorage.getItem(config.auth.refreshTokenStorageKey),
  setRefreshToken: (token: string) => localStorage.setItem(config.auth.refreshTokenStorageKey, token),
  getUser: () => {
    const userData = localStorage.getItem(config.auth.userStorageKey);
    return userData ? JSON.parse(userData) : null;
  },
  setUser: (user: UserData) => localStorage.setItem(config.auth.userStorageKey, JSON.stringify(user)),
  clearAll: () => {
    // Clear from localStorage
    localStorage.removeItem(config.auth.tokenStorageKey);
    localStorage.removeItem(config.auth.refreshTokenStorageKey);
    localStorage.removeItem(config.auth.userStorageKey);
    
    // Clear from sessionStorage as well to ensure complete cleanup
    sessionStorage.removeItem(config.auth.tokenStorageKey);
    sessionStorage.removeItem(config.auth.refreshTokenStorageKey);
    sessionStorage.removeItem(config.auth.userStorageKey);
  }
};

// Get CSRF token from cookies
function getCsrfToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
}

// Add CSRF token, authentication token, and request debugging for development
authApi.interceptors.request.use(request => {
  // Add CSRF token to headers if available
  const csrfToken = getCsrfToken();
  if (csrfToken && request.headers) {
    request.headers['X-CSRFToken'] = csrfToken;
  }

  // Add authentication token if available - using our storage helper
  const token = storage.getToken();
  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

// Add response debugging for development
authApi.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add request interceptor to include authentication token
api.interceptors.request.use(request => {
  // Add authentication token if available - using our storage helper
  const token = storage.getToken();
  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          storage.clearAll(); // Clean up any partial state
          return Promise.reject(error);
        }

        const response = await authApi.post(config.auth.refreshTokenEndpoint, {
          refresh: refreshToken
        });

        if (response.data.access) {
          // Update the access token
          storage.setToken(response.data.access);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Only clear auth data and redirect if it's not a profile completion request
        if (!originalRequest.url || !originalRequest.url.includes('complete_profile')) {
          storage.clearAll();
          window.location.href = config.auth.loginEndpoint;
        }
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  // Login the user and store user details and token
  async login(data: LoginData): Promise<UserData> {
    try {
      // Clear any existing data before login
      storage.clearAll();
      
      const response = await authApi.post(config.auth.loginEndpoint, {
        email: data.email,
        password: data.password,
        remember: data.rememberMe
      });

      // Make sure we properly store tokens
      if (response.data.tokens) {
        storage.setToken(response.data.tokens.access);
        storage.setRefreshToken(response.data.tokens.refresh);
      }

      // Store user data with profileCompleted field
      if (response.data.user) {
        const userData = {
          ...response.data.user,
          profileCompleted: response.data.user.profile_completed === true
        };
        storage.setUser(userData);
        return userData;
      }

      return response.data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  async register(data: RegistrationData): Promise<any> {
    try {
      // Transform camelCase to snake_case for backend
      const apiData = {
        email: data.email,
        username: data.username,
        password1: data.password1,
        password2: data.password2,
        marketing_consent: data.marketingConsent,
        profile_completed: data.profileCompleted
      };

      const response = await authApi.post(config.auth.registerEndpoint, apiData);

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Logout the user
  async logout(): Promise<void> {
    try {
      // Use our storage helper to clear all auth data consistently
      storage.clearAll();
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /// Verify email with token
  async verifyEmail(token: string): Promise<any> {
    try {
      // Make a single POST request to verify the email
      const response = await authApi.post(`${config.auth.verifyEmailEndpoint}${token}/`);

      // If verification is successful and returns tokens, store them
      if (response.data.tokens) {
        storage.setToken(response.data.tokens.access);
        storage.setRefreshToken(response.data.tokens.refresh);
      }

      // If user data is returned, store it
      if (response.data.user) {
        storage.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<any> {
    try {
      const response = await authApi.post(config.auth.resendVerificationEndpoint, { email });
      return response.data;
    } catch (error) {
      console.error('Resend verification email error:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Resend Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Utility function to transform snake_case to camelCase
  transformToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformToCamelCase(item));
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );
        acc[camelKey] = this.transformToCamelCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  // Helper: Convert camelCase to snake_case
  toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  // Get the current user's profile with fresh data from server
  async getCurrentUser(): Promise<UserData | null> {
    try {
      const token = storage.getToken();
      if (!token) {
        return null;
      }

      const response = await api.get(config.auth.profileEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Transform snake_case to camelCase
      const camelCaseData = this.transformToCamelCase(response.data);
      
      // Ensure profileCompleted is a boolean
      const userData = {
        ...camelCaseData,
        profileCompleted: !!camelCaseData.profileCompleted
      };
      
      // Update local storage with new user data
      storage.setUser(userData);
      
      return userData;
    } catch (error: any) {
      // If there's an auth error, clear everything
      if (error.response?.status === 401) {
        storage.clearAll();
        return null;
      }
      
      console.error('Error getting current user:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Update user profile
  async updateProfile(data: ProfileUpdateData): Promise<UserData> {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value); // Use camelCase keys only
        }
      });

      // Debug: Print FormData keys and values
      for (const pair of formData.entries()) {
        // eslint-disable-next-line no-console
        console.log(`[updateProfile] FormData: ${pair[0]} =`, pair[1]);
      }

      const response = await api.patch(config.auth.updateEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.data) {
        throw new Error('Invalid response from profile update');
      }

      // Transform snake_case to camelCase
      const camelCaseData = this.transformToCamelCase(response.data);
      
      // Ensure profileCompleted is a boolean
      const userData = {
        ...camelCaseData,
        profileCompleted: !!camelCaseData.profileCompleted
      };
      
      // Update local storage with new user data
      storage.setUser(userData);

      return userData;
    } catch (error: any) {
      console.error('AuthService - Profile update API error:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Complete user profile (initial onboarding)
  async completeProfile(data: any): Promise<UserData> {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Convert camelCase keys to snake_case for backend compatibility
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // Convert keys to snake_case for backend
        const snakeKey = this.toSnakeCase(key);
        if (value !== undefined && value !== null) {
          // Only append if value is string, File, or Blob
          if (typeof value === 'string' || value instanceof Blob) {
            formData.append(snakeKey, value);
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            formData.append(snakeKey, String(value));
          }
        }
      });
      
      // Debug: Print FormData keys and values
      for (const pair of formData.entries()) {
        // eslint-disable-next-line no-console
        console.log(`[completeProfile] FormData: ${pair[0]} =`, pair[1]);
      }
      
      const response = await api.post(config.auth.completeProfileEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.data) {
        throw new Error('Invalid response from profile completion');
      }
      
      // Transform snake_case to camelCase
      const camelCaseData = this.transformToCamelCase(response.data);
      
      // Ensure profileCompleted is a boolean
      const userData = {
        ...camelCaseData,
        profileCompleted: !!camelCaseData.profileCompleted
      };
      
      // Update local storage with new user data
      storage.setUser(userData);
      
      return userData;
    } catch (error: any) {
      console.error('AuthService - Profile completion API error:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Profile Completion Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Check if a national ID is already registered
  async checkNationalId(nationalId: string): Promise<boolean> {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use a GET request with query parameters instead of POST
      const response = await authApi.get(`/users/profiles/check_national_id/?national_id_number=${nationalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // The backend returns {exists: true/false}
      return response.data.exists === true;
    } catch (error) {
      console.error('Error checking national ID:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = storage.getToken();
    const user = storage.getUser();
    return !!(token && user);
  }

  // Get access token
  getAccessToken(): string | null {
    return storage.getToken();
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await authApi.post(config.auth.passwordResetEndpoint, { email });
      return response.data;
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Reset Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }

  // Confirm password reset
  async confirmPasswordReset(uid: string, token: string, newPassword1: string, newPassword2: string): Promise<any> {
    try {
      const response = await authApi.post(
        `${config.auth.passwordResetConfirmEndpoint}${uid}/${token}/`,
        {
          newPassword1,
          newPassword2
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error confirming password reset:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Reset Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  }
}

function getErrorMessage(error: any): string {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unknown error occurred.';
  }
}

export default new AuthService();