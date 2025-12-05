import apiClient from '../lib/api-client';
import type { Mission, MissionSubmission } from '../types';

export interface MissionsParams {
  category_id?: number;
  difficulty?: string;
  status?: string;
  skip?: number;
  limit?: number;
}

export interface SubmissionCreate {
  mission_id: number;
  submission_text: string;
  submission_file?: File;
}

export interface SubmissionReview {
  status: 'approved' | 'rejected';
  feedback?: string;
  points_awarded?: number;
}

export const missionService = {
  /**
   * Get all missions with optional filters
   */
  async getMissions(params?: MissionsParams): Promise<Mission[]> {
    const response = await apiClient.get<Mission[]>('/missions', { params });
    return response.data;
  },

  /**
   * Get a specific mission by ID
   */
  async getMissionById(id: number): Promise<Mission> {
    const response = await apiClient.get<Mission>(`/missions/${id}`);
    return response.data;
  },

  /**
   * Create a new mission (teacher/admin only)
   */
  async createMission(data: Partial<Mission>): Promise<Mission> {
    const response = await apiClient.post<Mission>('/missions', data);
    return response.data;
  },

  /**
   * Update a mission (teacher/admin only)
   */
  async updateMission(id: number, data: Partial<Mission>): Promise<Mission> {
    const response = await apiClient.put<Mission>(`/missions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a mission (teacher/admin only)
   */
  async deleteMission(id: number): Promise<void> {
    await apiClient.delete(`/missions/${id}`);
  },

  /**
   * Submit a mission
   */
  async submitMission(data: SubmissionCreate): Promise<MissionSubmission> {
    const formData = new FormData();
    formData.append('mission_id', data.mission_id.toString());
    formData.append('submission_text', data.submission_text);
    if (data.submission_file) {
      formData.append('submission_file', data.submission_file);
    }

    const response = await apiClient.post<MissionSubmission>(
      `/missions/${data.mission_id}/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Get user's submissions
   */
  async getMySubmissions(): Promise<MissionSubmission[]> {
    const response = await apiClient.get<MissionSubmission[]>('/missions/my-submissions');
    return response.data;
  },

  /**
   * Get all submissions (teacher/admin only)
   */
  async getSubmissions(params?: {
    mission_id?: number;
    student_id?: number;
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<MissionSubmission[]> {
    const response = await apiClient.get<MissionSubmission[]>('/missions/submissions', {
      params,
    });
    return response.data;
  },

  /**
   * Get a specific submission
   */
  async getSubmissionById(id: number): Promise<MissionSubmission> {
    const response = await apiClient.get<MissionSubmission>(`/missions/submissions/${id}`);
    return response.data;
  },

  /**
   * Review a submission (teacher/admin only)
   */
  async reviewSubmission(id: number, review: SubmissionReview): Promise<MissionSubmission> {
    const response = await apiClient.post<MissionSubmission>(
      `/missions/submissions/${id}/review`,
      review
    );
    return response.data;
  },

  /**
   * Update a submission
   */
  async updateSubmission(
    id: number,
    data: Partial<MissionSubmission>
  ): Promise<MissionSubmission> {
    const response = await apiClient.put<MissionSubmission>(
      `/missions/submissions/${id}`,
      data
    );
    return response.data;
  },
};
