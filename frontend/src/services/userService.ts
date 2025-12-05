import apiClient from '../lib/api-client';

export interface UserLevel {
  level_name: string;
  level_color: string;
  current_points: number;
  min_points: number;
  max_points: number;
  progress_percentage: number;
  next_level_points?: number;
}

export interface UserWithStats {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  total_points: number;
  missions_completed: number;
  badges_earned: number;
  team?: {
    team_id: number;
    team_name: string;
    role: string;
  };
  level: UserLevel;
  global_rank: number;
}

export const userService = {
  /**
   * Get current user statistics
   */
  async getMyStats(): Promise<UserWithStats> {
    const response = await apiClient.get<UserWithStats>('/users/me/stats');
    return response.data;
  },

  /**
   * Get user rankings/leaderboard
   */
  async getRankings(params?: {
    limit?: number;
    skip?: number;
    role?: string;
  }): Promise<UserWithStats[]> {
    const response = await apiClient.get<UserWithStats[]>('/users/rankings', { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<any> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Get user statistics by ID
   */
  async getUserStats(id: number): Promise<UserWithStats> {
    const response = await apiClient.get<UserWithStats>(`/users/${id}/stats`);
    return response.data;
  },
};
