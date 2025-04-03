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

// Create a separate axios instance for API endpoints (which use the /api prefix)
const api = axios.create({
  baseURL: config.apiUrl,
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

// Add CSRF token, authentication token, and request debugging for development
authApi.interceptors.request.use(request => {
  // Add CSRF token to headers if available
  const csrfToken = getCsrfToken();
  if (csrfToken && request.headers) {
    request.headers['X-CSRFToken'] = csrfToken;
  }

  // Add authentication token if available
  const token = localStorage.getItem(config.auth.tokenStorageKey);
  if (token && request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`;
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

// Add request interceptor to include authentication token
api.interceptors.request.use(request => {
  // Add authentication token if available
  const token = localStorage.getItem(config.auth.tokenStorageKey);
  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  // Log request details for debugging
  console.log('API Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });

  return request;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  response => {
    // Log successful responses for debugging
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem(config.auth.refreshTokenStorageKey);
        if (!refreshToken) {
          console.error('No refresh token found');
          return Promise.reject(error);
        }

        const response = await authApi.post(config.auth.refreshTokenEndpoint, {
          refresh: refreshToken
        });

        if (response.data.access) {
          // Update the access token
          localStorage.setItem(config.auth.tokenStorageKey, response.data.access);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Only clear auth data and redirect if it's not a profile completion request
        if (!originalRequest.url || !originalRequest.url.includes('complete_profile')) {
          localStorage.removeItem(config.auth.tokenStorageKey);
          localStorage.removeItem(config.auth.refreshTokenStorageKey);
          localStorage.removeItem(config.auth.userStorageKey);
          window.location.href = config.auth.loginEndpoint;
        }
      }
    }

    // Log error responses for debugging
    console.error('API Error:', {
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

      // Make sure we properly store tokens
      if (response.data.tokens) {
        localStorage.setItem(config.auth.tokenStorageKey, response.data.tokens.access);
        localStorage.setItem(config.auth.refreshTokenStorageKey, response.data.tokens.refresh);
      }

      // Store user data with profileComplete field
      if (response.data.user) {
        const userData = {
          ...response.data.user,
          profileComplete: response.data.user.profile_completed === true
        };
        localStorage.setItem(config.auth.userStorageKey, JSON.stringify(userData));
        return userData;
      }

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
      // Log data for debugging (but hide sensitive file data)
      console.log('Updating profile with data:', {
        ...data,
        nationalIdFront: data.nationalIdFront ? '(file data hidden)' : null,
        nationalIdBack: data.nationalIdBack ? '(file data hidden)' : null
      });
  
      // Get the current token before proceeding
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) {
        console.error("Token missing in updateProfile");
        // Try to get refresh token and refresh the access token
        const refreshToken = localStorage.getItem(config.auth.refreshTokenStorageKey);
        if (refreshToken) {
          try {
            const refreshResponse = await authApi.post(config.auth.refreshTokenEndpoint, {
              refresh: refreshToken
            });
            
            if (refreshResponse.data.access) {
              // Update token and continue
              localStorage.setItem(config.auth.tokenStorageKey, refreshResponse.data.access);
            } else {
              throw new Error('No authentication token found and refresh failed');
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            throw new Error('No authentication token found and refresh failed');
          }
        } else {
          throw new Error('No authentication token found');
        }
      }
  
      const formData = new FormData();
      
      // Add profileCompleted field
      const profileCompleted = data.profileCompleted !== undefined ? data.profileCompleted : true;
      
      // Transform camelCase to snake_case for backend
      const transformedData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        location: data.location,
        date_of_birth: data.dateOfBirth,
        national_id_number: data.nationalIdNumber,
        national_id_front: data.nationalIdFront,
        national_id_back: data.nationalIdBack,
        profile_completed: profileCompleted
      };
  
      // Build the form data
      Object.entries(transformedData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
  
      // Get the updated token after possible refresh
      const updatedToken = localStorage.getItem(config.auth.tokenStorageKey);
      if (!updatedToken) {
        throw new Error('No authentication token found after refresh attempt');
      }
  
      // Make the API request
      console.log('Making profile update request with token:', updatedToken.substring(0, 10) + '...');
      const response = await authApi.post(config.auth.completeProfileEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${updatedToken}`
        },
      });
  
      console.log('Profile updated successfully:', response.data);
      
      // Update local storage with new user data
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { 
          ...currentUser, 
          ...response.data, 
          profileComplete: true // Ensure this is set to true after successful profile completion
        };
        localStorage.setItem(config.auth.userStorageKey, JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  }

  // Check if a national ID is already registered
  async checkNationalId(nationalId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem(config.auth.tokenStorageKey);
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use a GET request with query parameters instead of POST
      const response = await authApi.get(`/users/profiles/check_national_id/?national_id_number=${nationalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the response for debugging
      console.log('National ID check response:', response.data);
      
      // The backend returns {exists: true/false}
      return response.data.exists === true;
    } catch (error) {
      console.error('National ID check error:', error);
      throw error;
    }
  }

  // Get the current user from local storage
  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem(config.auth.userStorageKey);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Ensure profileComplete is a boolean
        return {
          ...userData,
          profileComplete: userData.profileComplete === true
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
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
