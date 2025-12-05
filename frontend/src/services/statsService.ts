import apiClient from '../lib/api-client';

export interface ImpactMetrics {
  devices_saved: number;
  co2_reduced_kg: number;
  money_saved_eur: number;
  trees_equivalent: number;
}

export interface TopTeam {
  team_id: number;
  team_name: string;
  school_name?: string;
  total_points: number;
  rank: number;
}

export interface GlobalStats {
  total_users: number;
  total_teams: number;
  total_schools: number;
  total_missions: number;
  total_submissions: number;
  approved_submissions: number;
  total_points_awarded: number;
  total_resources: number;
  total_forum_posts: number;
  active_users_last_30_days: number;
  impact: ImpactMetrics;
  top_teams: TopTeam[];
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
