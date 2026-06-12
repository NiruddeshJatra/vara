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

// Response interceptor - silent token refresh on 401
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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
