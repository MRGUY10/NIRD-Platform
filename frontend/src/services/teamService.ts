import apiClient from '../lib/api-client';
import type { Team, TeamMember } from '../types';

export interface CreateTeamData {
  name: string;
  description?: string;
  max_members?: number;
}

export interface JoinTeamData {
  team_code: string;
}

export const teamService = {
  /**
   * Get all teams
   */
  async getTeams(params?: { school_id?: number }): Promise<Team[]> {
    const response = await apiClient.get<Team[]>('/teams', { params });
    return response.data;
  },

  /**
   * Get team leaderboard
   */
  async getTeamLeaderboard(): Promise<Team[]> {
    const response = await apiClient.get<Team[]>('/teams/leaderboard');
    return response.data;
  },

  /**
   * Create a new team (teacher only)
   */
  async createTeam(data: CreateTeamData): Promise<Team> {
    const response = await apiClient.post<Team>('/teams', data);
    return response.data;
  },

  /**
   * Get current user's team
   */
  async getMyTeam(): Promise<Team> {
    const response = await apiClient.get<Team>('/teams/my-team');
    return response.data;
  },

  /**
   * Get a specific team by ID
   */
  async getTeamById(id: number): Promise<Team> {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  /**
   * Update a team (teacher only)
   */
  async updateTeam(id: number, data: Partial<Team>): Promise<Team> {
    const response = await apiClient.put<Team>(`/teams/${id}`, data);
    return response.data;
  },

  /**
   * Delete a team (teacher only)
   */
  async deleteTeam(id: number): Promise<void> {
    await apiClient.delete(`/teams/${id}`);
  },

  /**
   * Join a team using team code
   */
  async joinTeam(teamId: number, data: JoinTeamData): Promise<TeamMember> {
    const response = await apiClient.post<TeamMember>(`/teams/${teamId}/members`, data);
    return response.data;
  },

  /**
   * Remove a member from team
   */
  async removeMember(teamId: number, userId: number): Promise<void> {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
  },

  /**
   * Get team statistics
   */
  async getTeamStats(teamId: number): Promise<any> {
    const response = await apiClient.get(`/teams/${teamId}/stats`);
    return response.data;
  },
};
