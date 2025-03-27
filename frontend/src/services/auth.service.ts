import axios from 'axios';
import api from './api.service';
import config from '../config';

// Create a separate axios instance for auth endpoints (which don't use the /api prefix)
const authApi = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get CSRF token from cookies
function getCsrfToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
}

// Add CSRF token and request debugging for development
authApi.interceptors.request.use(request => {
  // Add CSRF token to headers if available
  const csrfToken = getCsrfToken();
  if (csrfToken && request.headers) {
    request.headers['X-CSRFToken'] = csrfToken;
  }
  
  console.log('Auth API Request:', { 
    url: request.url, 
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

// Add response debugging for development
authApi.interceptors.response.use(
  response => {
    console.log('Auth API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  error => {
    console.error('Auth API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  date_of_birth?: string;
}

export interface UserData {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  profile_picture: string | null;
  is_verified: boolean;
  is_trusted: boolean;
  average_rating: number;
}

export interface AuthResponse {
  user: UserData;
  access_token?: string;
  refresh_token?: string;
}

class AuthService {
  // Login the user and store user details and token
  async login(data: LoginData): Promise<UserData> {
    try {
      // Use the dj-rest-auth login endpoint
      const response = await authApi.post(config.auth.loginEndpoint, {
        email: data.email,
        password: data.password
      });
      
      // Store user and tokens in localStorage
      if (response.data.user) {
        localStorage.setItem(config.auth.userStorageKey, JSON.stringify(response.data.user));
        if (response.data.access_token) {
          localStorage.setItem(config.auth.tokenStorageKey, response.data.access_token);
        }
      }
      
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register a new user
  async register(data: RegisterData): Promise<any> {
    try {
      console.log('Attempting registration with data:', {
        ...data,
        password1: '(hidden for security)',
        password2: '(hidden for security)'
      });
      
      // First, get CSRF token if needed
      try {
        await authApi.get('/csrf/');
      } catch (error) {
        console.log('CSRF token fetch optional, continuing with registration');
      }
      
      // Use the dj-rest-auth registration endpoint
      const response = await authApi.post(config.auth.registerEndpoint, {
        email: data.email,
        username: data.username,
        password1: data.password1,
        password2: data.password2,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        location: data.location,
        date_of_birth: data.date_of_birth
      });
      
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle common registration errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        // Check if the error is about existing email/username
        if (errorData.email && errorData.email[0].includes('already exists')) {
          throw new Error('An account with this email already exists.');
        }
        if (errorData.username && errorData.username[0].includes('already exists')) {
          throw new Error('This username is already taken.');
        }
        
        // Handle password errors
        if (errorData.password1) {
          throw new Error(errorData.password1[0]);
        }
        if (errorData.non_field_errors) {
          throw new Error(errorData.non_field_errors[0]);
        }
      }
      
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout the user
  logout(): void {
    authApi.post(config.auth.logoutEndpoint)
      .then(() => {
        localStorage.removeItem(config.auth.userStorageKey);
        localStorage.removeItem(config.auth.tokenStorageKey);
      })
      .catch(error => {
        console.error('Logout error:', error);
        // Still remove the user data from localStorage even if the API call fails
        localStorage.removeItem(config.auth.userStorageKey);
        localStorage.removeItem(config.auth.tokenStorageKey);
      });
  }

  // Verify email with token
  async verifyEmail(key: string): Promise<any> {
    try {
      // Use correct endpoint for email verification
      const response = await authApi.post(config.auth.verifyEmailEndpoint, { key });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Get the current user from local storage
  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem(config.auth.userStorageKey);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(config.auth.tokenStorageKey);
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const response = await authApi.post(config.auth.refreshTokenEndpoint);
      
      if (response.data.access) {
        localStorage.setItem(config.auth.tokenStorageKey, response.data.access);
        return response.data.access;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return null;
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await authApi.post(config.auth.passwordResetEndpoint, { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Confirm password reset
  async confirmPasswordReset(uid: string, token: string, new_password1: string, new_password2: string): Promise<any> {
    try {
      const response = await authApi.post(config.auth.passwordResetConfirmEndpoint, {
        uid,
        token,
        new_password1,
        new_password2
      });
      return response.data;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  }
}

export default new AuthService();
