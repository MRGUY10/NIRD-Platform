import apiClient, { getErrorMessage } from '../lib/api-client';

export interface ImpactMetrics {
  devices_saved: number;
  co2_reduced_kg: number;
  money_saved_eur: number;
  trees_equivalent: number;
}

export interface TopTeam {
  team_id: number;
  team_name: string;
  school_name?: string | null;
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

export interface TeamActivityDay {
  date: string;
  missions_completed: number;
  points_earned: number;
}

export interface TeamMemberStats {
  user_id: number;
  username: string;
  full_name: string;
  missions_completed: number;
  points_contributed: number;
  badges_earned: number;
}

export interface TopCategory {
  category_name: string;
  missions_completed: number;
}

export interface TeamStats {
  team_id: number;
  team_name: string;
  school_name?: string | null;
  total_points: number;
  total_missions_completed: number;
  badges_earned: number;
  current_rank?: number | null;
  impact: ImpactMetrics;
  activity_timeline: TeamActivityDay[];
  member_stats: TeamMemberStats[];
  top_categories: TopCategory[];
}

export const statsService = {
  async getGlobal(): Promise<GlobalStats> {
    try {
      const { data } = await apiClient.get<GlobalStats>('/stats/global');
      return data;
    } catch (err) {
      console.error('getGlobal stats error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async getTeam(teamId: number): Promise<TeamStats> {
    try {
      const { data } = await apiClient.get<TeamStats>(`/stats/team/${teamId}`);
      return data;
    } catch (err) {
      console.error('getTeam stats error:', err);
      throw new Error(getErrorMessage(err));
    }
  },
};
