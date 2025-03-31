import axios from 'axios';
import config from '../config';
import { RegistrationData, ProfileFormData, LoginData, UserData } from '../types/auth';


// Create a separate axios instance for auth endpoints (which don't use the /api prefix)
// This configuration:
// 1. Uses the base URL without /api prefix
// 2. Sends cookies with requests (needed for authentication)
// 3. Automatically sets JSON content type
// 4. Includes CSRF token for security
// 5. Logs all requests for debugging
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

class AuthService {
  // Login the user and store user details and token
  async login(data: LoginData): Promise<UserData> {
    try {
      console.log('Attempting login with email:', data.email);

      const response = await authApi.post(config.auth.loginEndpoint, {
        email: data.email,
        password: data.password
      });

      console.log('Login successful:', response.data);
      return response.data.user;
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  // This function:
  // 1. Takes user registration data
  // 2. Makes a secure API call to register the user
  // 3. Returns the server's response or throws an error
  // 4. Includes specific error handling for common registration issues
  async register(data: RegistrationData): Promise<any> {
    try {
      console.log('Attempting registration with data:', {
        ...data,
        password: '(hidden for security)'
      });

      // Use the dj-rest-auth registration endpoint
      const response = await authApi.post(config.auth.registerEndpoint, {
        email: data.email,
        username: data.username,
        password: data.password,
        termsAgreed: data.termsAgreed,
        marketingConsent: data.marketingConsent
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
        if (errorData.password) {
          throw new Error(errorData.password[0]);
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

  async updateProfile(data: ProfileFormData): Promise<any> {
    try {
      console.log('Updating profile with data:', {
        ...data,
        nationalIdFront: '(file data hidden)',
        nationalIdBack: '(file data hidden)'
      });

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await authApi.patch(config.auth.profileEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile updated successfully:', response.data);
      return response.data;

    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
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
