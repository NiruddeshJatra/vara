import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,   // CRITICAL: sends httpOnly refresh cookie automatically
});

// Request interceptor - attach access token
api.interceptors.request.use((reqConfig) => {
  const token = window.__accessToken__;   // see AuthContext for how this is set
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

// Auth endpoints must never trigger the refresh-and-retry cascade: a 401 here
// is a real credential/OTP error to surface, not an expired session. Refreshing
// (and redirecting) on the login call's own 401 would reload the page and hide
// the error.
const AUTH_ENDPOINTS = [
  '/auth/login/',
  '/auth/token/refresh/',
  '/auth/otp/request/',
  '/auth/otp/verify/',
];

const isAuthEndpoint = (url?: string) =>
  !!url && AUTH_ENDPOINTS.some((path) => url.includes(path));

// Response interceptor - silent token refresh on 401
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only refresh-and-retry (at most once) for 401s on authenticated endpoints.
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthEndpoint(originalRequest?.url)
    ) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/auth/token/refresh/');
        const newToken = response.data.data.access_token;
        window.__accessToken__ = newToken;
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        // Refresh failed - user must log in again
        window.__accessToken__ = null;
        window.location.href = '/auth/login/';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
