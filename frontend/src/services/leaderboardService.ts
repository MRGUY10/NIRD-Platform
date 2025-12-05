import apiClient from '../lib/api-client';

export interface LeaderboardEntry {
  rank: number;
  team_id: number;
  team_name: string;
  school_name?: string;
  total_points: number;
  member_count: number;
  completed_missions: number;
  average_score: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  current_user_team?: LeaderboardEntry;
  total_teams: number;
  page: number;
  page_size: number;
}

export interface TeamRankHistory {
  team_id: number;
  team_name: string;
  history: {
    date: string;
    rank: number;
    points: number;
  }[];
}

export interface LeaderboardStats {
  total_teams: number;
  total_points: number;
  average_points_per_team: number;
  most_active_team: {
    team_id: number;
    team_name: string;
    completed_missions: number;
  };
}

export const leaderboardService = {
  /**
   * Get leaderboard rankings
   */
  async getLeaderboard(params?: {
    school_id?: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
    page?: number;
    page_size?: number;
  }): Promise<LeaderboardResponse> {
    const response = await apiClient.get<LeaderboardResponse>('/leaderboard', { params });
    return response.data;
  },

  /**
   * Get team rank history
   */
  async getTeamHistory(teamId: number, days?: number): Promise<TeamRankHistory> {
    const response = await apiClient.get<TeamRankHistory>(`/leaderboard/team/${teamId}/history`, {
      params: { days },
    });
    return response.data;
  },

  /**
   * Get leaderboard statistics
   */
  async getStats(): Promise<LeaderboardStats> {
    const response = await apiClient.get<LeaderboardStats>('/leaderboard/stats');
    return response.data;
  },

  /**
   * Stream leaderboard updates (SSE)
   */
  getLeaderboardStream(onUpdate: (data: LeaderboardResponse) => void): EventSource {
    const token = localStorage.getItem('access_token');
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/leaderboard/stream?token=${token}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    return eventSource;
  },
};
