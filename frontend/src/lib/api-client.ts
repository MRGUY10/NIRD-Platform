import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - redirect to login (but not during login itself)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // FastAPI returns errors in 'detail' field
    if (axiosError.response?.data?.detail) {
      return typeof axiosError.response.data.detail === 'string' 
        ? axiosError.response.data.detail 
        : JSON.stringify(axiosError.response.data.detail);
    }
    
    // Fallback to nested error object
    if (axiosError.response?.data?.error?.message) {
      return axiosError.response.data.error.message;
    }
    
    // Network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d\'exécution.';
    }
    
    // Timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'La requête a expiré. Veuillez réessayer.';
    }
    
    return axiosError.message || 'Une erreur inattendue s\'est produite';
  }
  return 'Une erreur inattendue s\'est produite';
};

// Upload URL helper
export const getUploadUrl = (path?: string): string => {
  if (!path) return '';
  const uploadBaseUrl = import.meta.env.VITE_UPLOAD_URL || 'http://127.0.0.1:8000/uploads';
  return path.startsWith('http') ? path : `${uploadBaseUrl}/${path}`;
};
