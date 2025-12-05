import apiClient from '../lib/api-client';

export interface GlobalStats {
  total_users: number;
  total_teams: number;
  total_missions: number;
  total_submissions: number;
  total_points: number;
  active_users_today: number;
  missions_completed_today: number;
  top_performing_school?: {
    id: number;
    name: string;
    total_points: number;
  };
}

export interface TeamStats {
  team_id: number;
  team_name: string;
  total_points: number;
  total_missions_completed: number;
  average_score: number;
  member_count: number;
  active_members: number;
  top_contributors: {
    user_id: number;
    full_name: string;
    points: number;
  }[];
  recent_activity: {
    date: string;
    missions_completed: number;
    points_earned: number;
  }[];
}

export const statsService = {
  /**
   * Get global platform statistics
   */
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await apiClient.get<GlobalStats>('/stats/global');
    return response.data;
  },

  /**
   * Get statistics for a specific team
   */
  async getTeamStats(teamId: number): Promise<TeamStats> {
    const response = await apiClient.get<TeamStats>(`/stats/team/${teamId}`);
    return response.data;
  },
};
