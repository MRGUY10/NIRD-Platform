import apiClient from '../lib/api-client';
import type { User, Team } from '../types';

export interface DashboardStats {
  total_users: number;
  total_teams: number;
  total_missions: number;
  total_submissions: number;
  pending_submissions: number;
  active_users_today: number;
  new_users_this_week: number;
  missions_completed_today: number;
}

export interface UserManagementSummary extends User {
  team_name?: string;
  last_activity?: string;
  submission_count?: number;
}

export const adminService = {
  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard');
    return response.data;
  },

  /**
   * Get all users (paginated)
   */
  async getUsers(params?: {
    role?: string;
    school_id?: number;
    is_active?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<UserManagementSummary[]> {
    const response = await apiClient.get<UserManagementSummary[]>('/admin/users', { params });
    return response.data;
  },

  /**
   * Get a specific user
   */
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update a user
   */
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  /**
   * Get all teams
   */
  async getTeams(params?: {
    school_id?: number;
    teacher_id?: number;
    is_active?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<Team[]> {
    const response = await apiClient.get<Team[]>('/admin/teams', { params });
    return response.data;
  },

  /**
   * Update a team
   */
  async updateTeam(id: number, data: Partial<Team>): Promise<Team> {
    const response = await apiClient.put<Team>(`/admin/teams/${id}`, data);
    return response.data;
  },

  /**
   * Get pending submissions
   */
  async getPendingSubmissions(params?: {
    mission_id?: number;
    team_id?: number;
    skip?: number;
    limit?: number;
  }): Promise<any[]> {
    const response = await apiClient.get('/admin/submissions', { params });
    return response.data;
  },

  /**
   * Export data report
   */
  async exportReport(type: 'users' | 'teams' | 'missions' | 'submissions'): Promise<any> {
    const response = await apiClient.post(`/admin/reports/export`, { report_type: type });
    return response.data;
  },
};
