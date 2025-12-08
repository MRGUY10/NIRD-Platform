import apiClient, { getErrorMessage } from '../lib/api-client';

export interface UserBadgeItem {
  id: number;
  badge_id: number;
  badge_name: string;
  badge_slug: string;
  badge_description?: string;
  badge_icon?: string;
  earned_at: string;
}

export const badgeService = {
  async getMyBadges(): Promise<UserBadgeItem[]> {
    try {
      const { data } = await apiClient.get<UserBadgeItem[]>('/badges/me');
      return data;
    } catch (err) {
      console.error('getMyBadges error:', err);
      throw new Error(getErrorMessage(err));
    }
  },
};
