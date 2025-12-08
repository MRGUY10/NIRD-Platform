import apiClient, { getErrorMessage } from '../lib/api-client';

export interface LeaderboardEntry {
  rank: number;
  team_id: number;
  team_name: string;
  school_name?: string;
  total_points: number;
  missions_completed: number;
  approved_submissions?: number;
  average_score?: number;
  rank_change?: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total_teams: number;
  last_updated: string;
  filters?: Record<string, any>;
}

export interface LeaderboardParams {
  skip?: number;
  limit?: number;
  school_id?: number;
  category_id?: number;
  days?: number;
}

export interface TeamRankSnapshot {
  rank: number;
  total_points: number;
  missions_completed: number;
  snapshot_at: string;
}

export interface TeamRankHistory {
  team_id: number;
  team_name: string;
  current_rank: number;
  current_points: number;
  snapshots: TeamRankSnapshot[];
  rank_trend: string; // 'up', 'down', 'stable'
}

export interface LeaderboardStats {
  total_teams: number;
  total_points: number;
  total_missions: number;
  active_teams: number;
  top_team: LeaderboardEntry | null;
}

/**
 * Leaderboard Service
 * Handles all leaderboard-related API calls
 */
export const leaderboardService = {
  /**
   * Get current leaderboard rankings
   */
  async getLeaderboard(params: LeaderboardParams = {}): Promise<LeaderboardResponse> {
    try {
      const response = await apiClient.get('/leaderboard', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get team's ranking history
   */
  async getTeamHistory(teamId: number, days: number = 30): Promise<TeamRankHistory> {
    try {
      const response = await apiClient.get(`/leaderboard/team/${teamId}/history`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team history:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get leaderboard statistics
   */
  async getStats(): Promise<LeaderboardStats> {
    try {
      const response = await apiClient.get('/leaderboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard stats:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get my team's current rank
   */
  async getMyRank(): Promise<{ rank: number; total_teams: number; percentile: number }> {
    try {
      const response = await apiClient.get('/leaderboard/my-rank');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my rank:', getErrorMessage(error));
      throw error;
    }
  }
};
