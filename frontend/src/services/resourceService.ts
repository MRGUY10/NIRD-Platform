import apiClient from '../lib/api-client';
import type { Resource } from '../types';

export interface ResourcesParams {
  category_id?: number;
  resource_type?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface CreateResourceData {
  title: string;
  description?: string;
  resource_type: string;
  category_id: number;
  url?: string;
  file?: File;
}

export const resourceService = {
  /**
   * Get all resources with optional filters
   */
  async getResources(params?: ResourcesParams): Promise<Resource[]> {
    const response = await apiClient.get<Resource[]>('/resources', { params });
    return response.data;
  },

  /**
   * Get a specific resource by ID
   */
  async getResourceById(id: number): Promise<Resource> {
    const response = await apiClient.get<Resource>(`/resources/${id}`);
    return response.data;
  },

  /**
   * Create a new resource (teacher/admin only)
   */
  async createResource(data: CreateResourceData): Promise<Resource> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('resource_type', data.resource_type);
    formData.append('category_id', data.category_id.toString());
    if (data.url) formData.append('url', data.url);
    if (data.file) formData.append('file', data.file);

    const response = await apiClient.post<Resource>('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update a resource (teacher/admin only)
   */
  async updateResource(id: number, data: Partial<Resource>): Promise<Resource> {
    const response = await apiClient.put<Resource>(`/resources/${id}`, data);
    return response.data;
  },

  /**
   * Delete a resource (teacher/admin only)
   */
  async deleteResource(id: number): Promise<void> {
    await apiClient.delete(`/resources/${id}`);
  },

  /**
   * Track resource download
   */
  async trackDownload(id: number): Promise<void> {
    await apiClient.post(`/resources/${id}/download`);
  },

  /**
   * Get resource statistics
   */
  async getResourceStats(): Promise<any> {
    const response = await apiClient.get('/resources/stats/summary');
    return response.data;
  },
};
