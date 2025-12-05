import apiClient from '../lib/api-client';
import type { Badge, UserBadge } from '../types';

export const badgeService = {
  /**
   * Get all available badges
   */
  async getAllBadges(): Promise<Badge[]> {
    const response = await apiClient.get<Badge[]>('/badges');
    return response.data;
  },

  /**
   * Get current user's badges
   */
  async getMyBadges(): Promise<UserBadge[]> {
    const response = await apiClient.get<UserBadge[]>('/badges/me');
    return response.data;
  },

  /**
   * Get badges for a specific user
   */
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    const response = await apiClient.get<UserBadge[]>(`/badges/user/${userId}`);
    return response.data;
  },
};
