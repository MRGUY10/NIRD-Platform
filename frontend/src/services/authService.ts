import apiClient from '../lib/api-client';
import type { AuthResponse, User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  school_name?: string;
}

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Verify token is valid
   */
  async verifyToken(): Promise<{ valid: boolean }> {
    const response = await apiClient.post<{ valid: boolean }>('/auth/verify-token');
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: { full_name?: string; avatar_url?: string }): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(data: { current_password: string; new_password: string }): Promise<void> {
    await apiClient.put('/auth/change-password', data);
  },

  /**
   * Get current user with statistics
   */
  async getMeWithStats(): Promise<any> {
    const response = await apiClient.get('/users/me/stats');
    return response.data;
  },
};
