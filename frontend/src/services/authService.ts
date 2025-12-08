import apiClient, { getErrorMessage } from '../lib/api-client';
import type { User } from '../types';

export interface ProfileUpdateData {
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export const authService = {
  async getMe(): Promise<User> {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch profile:', getErrorMessage(error));
      throw error;
    }
  },

  async updateProfile(data: ProfileUpdateData): Promise<User> {
    try {
      const res = await apiClient.put('/auth/me', data);
      return res.data;
    } catch (error) {
      console.error('Failed to update profile:', getErrorMessage(error));
      throw error;
    }
  },

  async changePassword(data: PasswordChangeData): Promise<{ message: string }> {
    try {
      const res = await apiClient.post('/auth/change-password', data);
      return res.data;
    } catch (error) {
      console.error('Failed to change password:', getErrorMessage(error));
      throw error;
    }
  },
};
