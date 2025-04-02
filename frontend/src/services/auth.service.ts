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
        password: data.password,
        remember: data.rememberMe
      });

      console.log('Login successful:', response.data);
      return response.data.user;
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Handle unverified user error
      if (error.response?.status === 401 && 
          error.response?.data?.detail === 'Email address is not verified.') {
        throw new Error('UNVERIFIED_EMAIL');
      }

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
        password1: '(hidden for security)',
        password2: '(hidden for security)'
      });

      // Transform camelCase to snake_case for backend
      const apiData = {
        email: data.email,
        username: data.username,
        password1: data.password1,
        password2: data.password2,
        terms_agreed: data.termsAgreed,
        marketing_consent: data.marketingConsent,
        profile_completed: data.profileCompleted
      };

      const response = await authApi.post(config.auth.registerEndpoint, apiData);

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
        if (errorData.password2) {
          throw new Error(errorData.password2[0]);
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
  async logout(): Promise<any> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        // Send the refresh token to the blacklist endpoint
        await axios.post(`${config.baseUrl}${config.auth.logoutEndpoint}`, {
          refresh: refreshToken
        });
      }
      
      // Clear local storage regardless of API response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      // Even if the API call fails, we should clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
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
        localStorage.setItem(config.auth.tokenStorageKey, response.data.tokens.access);
        localStorage.setItem(config.auth.refreshTokenStorageKey, response.data.tokens.refresh);
      }
      
      // If user data is returned, store it
      if (response.data.user) {
        localStorage.setItem(config.auth.userStorageKey, JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<any> {
    try {
      const response = await authApi.post(config.auth.resendVerificationEndpoint, { email });
      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error);
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
      const response = await authApi.post(
        `${config.auth.passwordResetConfirmEndpoint}${uid}/${token}/`,
        {
          new_password1,
          new_password2
        }
      );
      return response.data;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  }
}

export default new AuthService();
