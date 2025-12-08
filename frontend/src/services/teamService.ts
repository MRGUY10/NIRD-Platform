import apiClient, { getErrorMessage } from '../lib/api-client';
import type { Team, User } from '../types';

export interface TeamCreateData {
  name: string;
  description?: string;
  school_id?: number;
}

export interface TeamUpdateData {
  name?: string;
  description?: string;
  avatar_url?: string;
}

export interface TeamWithMembers extends Team {
  members: User[];
}

export interface JoinTeamData {
  team_code: string;
}

/**
 * Team Service
 * Handles all team-related API calls
 */
export const teamService = {
  /**
   * Get list of all teams
   */
  async listTeams(params?: { skip?: number; limit?: number; school_id?: number; is_active?: boolean }): Promise<Team[]> {
    try {
      const response = await apiClient.get('/teams', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch teams:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Add a member to the team (captain/admin only)
   */
  async addMember(teamId: number, data: { user_id: number; is_captain?: boolean }): Promise<{ message: string; user_id: number }> {
    try {
      const response = await apiClient.post(`/teams/${teamId}/members`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to add member:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get current user's team
   */
  async getMyTeam(): Promise<TeamWithMembers> {
    try {
      const response = await apiClient.get('/teams/my-team');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my team:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get a specific team by ID
   */
  async getTeam(teamId: number): Promise<TeamWithMembers> {
    try {
      const response = await apiClient.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Create a new team
   */
  async createTeam(data: TeamCreateData): Promise<Team> {
    try {
      const response = await apiClient.post('/teams', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create team:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Update team information
   */
  async updateTeam(teamId: number, data: TeamUpdateData): Promise<Team> {
    try {
      const response = await apiClient.put(`/teams/${teamId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update team:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Join a team using team code
   */
  async joinTeam(data: JoinTeamData): Promise<{ message: string; team: Team }> {
    try {
      const response = await apiClient.post('/teams/join', data);
      return response.data;
    } catch (error) {
      console.error('Failed to join team:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Leave current team
   */
  async leaveTeam(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/teams/leave');
      return response.data;
    } catch (error) {
      console.error('Failed to leave team:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Remove a member from team (captain only)
   */
  async removeMember(teamId: number, userId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/teams/${teamId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove member:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get team leaderboard (top teams)
   */
  async getLeaderboard(limit: number = 10): Promise<Team[]> {
    try {
      const response = await apiClient.get('/teams/leaderboard', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', getErrorMessage(error));
      throw error;
    }
  }
};
