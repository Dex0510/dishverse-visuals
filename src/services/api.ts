
import axios from 'axios';
import setupMockMiddleware from './mockMiddleware';
import webSocketService from './webSocketService';

// Base API URL - in a real app, this would be in an environment variable
const API_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup mock middleware to handle API calls when backend is unavailable
setupMockMiddleware(apiClient);

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the error doesn't have a response, it's a network error
    if (!error.response) {
      console.error('Network error or server unreachable.');
      
      // If WebSocket is connected, we might still get updates
      // Try to reconnect WebSocket if it's disconnected
      webSocketService.connect().catch(() => {
        // Silent catch - the WebSocketService handles reconnection internally
      });
      
      return Promise.reject(
        new Error('Cannot connect to server. Please check your internet connection.')
      );
    }
    
    const originalRequest = error.config;
    
    // If 401 unauthorized and not already retrying
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { token } = response.data;
          
          localStorage.setItem('authToken', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/sign-in';
      }
    }
    
    return Promise.reject(error);
  }
);

// Initialize WebSocket connection when API client is first used
apiClient.interceptors.request.use((config) => {
  // Try to establish WebSocket connection when first API request is made
  webSocketService.connect().catch(() => {
    // Silent catch - the WebSocketService handles reconnection internally
  });
  return config;
});

export default apiClient;
