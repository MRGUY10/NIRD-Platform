import apiClient from '../lib/api-client';
import type { Notification } from '../types';

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  async getNotifications(params?: { is_read?: boolean; skip?: number; limit?: number }): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications', { params });
    return response.data;
  },

  /**
   * Get count of unread notifications
   */
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread/count');
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: number): Promise<Notification> {
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ updated: number }> {
    const response = await apiClient.put<{ updated: number }>('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: number): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};
