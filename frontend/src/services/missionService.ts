import apiClient, { getErrorMessage } from '../lib/api-client';
import type { Mission, MissionSubmission, MissionDifficulty } from '../types';

export interface MissionListParams {
  skip?: number;
  limit?: number;
  category_id?: number;
  difficulty?: MissionDifficulty;
  is_active?: boolean;
}

export interface SubmissionCreateData {
  description: string;
  photo_url?: string;
  file_url?: string;
}

export interface MissionWithDetails extends Mission {
  approved_count?: number;
}

export interface ListSubmissionsParams {
  skip?: number;
  limit?: number;
  mission_id?: number;
  team_id?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/**
 * Mission Service
 * Handles all mission-related API calls
 */
export const missionService = {
  /**
   * Get list of missions with optional filters
   */
  async listMissions(params: MissionListParams = {}): Promise<Mission[]> {
    try {
      const response = await apiClient.get('/missions', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch missions:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get detailed mission information
   */
  async getMission(missionId: number): Promise<MissionWithDetails> {
    try {
      const response = await apiClient.get(`/missions/${missionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mission:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Submit a mission completion
   */
  async submitMission(missionId: number, data: SubmissionCreateData): Promise<MissionSubmission> {
    try {
      const response = await apiClient.post(`/missions/${missionId}/submit`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to submit mission:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get all submissions from the current user's team
   */
  async getMySubmissions(): Promise<MissionSubmission[]> {
    try {
      const response = await apiClient.get('/missions/my-submissions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch submissions:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Get a specific submission
   */
  async getSubmission(submissionId: number): Promise<MissionSubmission> {
    try {
      const response = await apiClient.get(`/missions/submissions/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch submission:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Update a pending submission
   */
  async updateSubmission(submissionId: number, data: Partial<SubmissionCreateData>): Promise<MissionSubmission> {
    try {
      const response = await apiClient.put(`/missions/submissions/${submissionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update submission:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Create a new mission (teachers/admins only)
   */
  async createMission(data: {
    title: string;
    description: string;
    category_id?: number;
    difficulty: MissionDifficulty;
    points: number;
    requires_photo?: boolean;
    requires_file?: boolean;
    requires_description?: boolean;
  }): Promise<Mission> {
    try {
      const response = await apiClient.post('/missions', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create mission:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Update a mission (teachers/admins only)
   */
  async updateMission(missionId: number, data: {
    title?: string;
    description?: string;
    difficulty?: MissionDifficulty;
    points?: number;
    is_active?: boolean;
  }): Promise<Mission> {
    try {
      const response = await apiClient.put(`/missions/${missionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update mission:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Delete a mission (admins only)
   */
  async deleteMission(missionId: number): Promise<void> {
    try {
      await apiClient.delete(`/missions/${missionId}`);
    } catch (error) {
      console.error('Failed to delete mission:', getErrorMessage(error));
      throw error;
    }
  }
};

export const submissionService = {
  async listSubmissions(params: ListSubmissionsParams = {}): Promise<MissionSubmission[]> {
    try {
      const response = await apiClient.get('/missions/submissions', { params });
      return response.data as MissionSubmission[];
    } catch (error) {
      console.error('Failed to list submissions:', getErrorMessage(error));
      throw error;
    }
  },

  /**
   * Review a submission (teachers/admins only)
   */
  async reviewSubmission(submissionId: number, data: {
    status: 'approved' | 'rejected';
    feedback?: string;
  }): Promise<MissionSubmission> {
    try {
      // Backend expects APPROVED/REJECTED in uppercase
      const reviewData = {
        status: data.status.toUpperCase(),
        review_comment: data.feedback,
      };
      const response = await apiClient.post(`/missions/submissions/${submissionId}/review`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Failed to review submission:', getErrorMessage(error));
      throw error;
    }
  },
};
