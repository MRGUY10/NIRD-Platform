import apiClient from '../lib/api-client';
import type { ForumPost, Comment } from '../types';

export interface PostsParams {
  category_id?: number;
  author_id?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  category_id: number;
}

export interface CreateCommentData {
  content: string;
}

export const forumService = {
  /**
   * Get all forum posts with optional filters
   */
  async getPosts(params?: PostsParams): Promise<ForumPost[]> {
    const response = await apiClient.get<ForumPost[]>('/forum/posts', { params });
    return response.data;
  },

  /**
   * Get a specific post by ID
   */
  async getPostById(id: number): Promise<ForumPost> {
    const response = await apiClient.get<ForumPost>(`/forum/posts/${id}`);
    return response.data;
  },

  /**
   * Create a new forum post
   */
  async createPost(data: CreatePostData): Promise<ForumPost> {
    const response = await apiClient.post<ForumPost>('/forum/posts', data);
    return response.data;
  },

  /**
   * Update a forum post
   */
  async updatePost(id: number, data: Partial<ForumPost>): Promise<ForumPost> {
    const response = await apiClient.put<ForumPost>(`/forum/posts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a forum post
   */
  async deletePost(id: number): Promise<void> {
    await apiClient.delete(`/forum/posts/${id}`);
  },

  /**
   * Get comments for a post
   */
  async getPostComments(postId: number): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(`/forum/posts/${postId}/comments`);
    return response.data;
  },

  /**
   * Create a comment on a post
   */
  async createComment(postId: number, data: CreateCommentData): Promise<Comment> {
    const response = await apiClient.post<Comment>(`/forum/posts/${postId}/comments`, data);
    return response.data;
  },

  /**
   * Update a comment
   */
  async updateComment(commentId: number, data: Partial<Comment>): Promise<Comment> {
    const response = await apiClient.put<Comment>(`/forum/comments/${commentId}`, data);
    return response.data;
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number): Promise<void> {
    await apiClient.delete(`/forum/comments/${commentId}`);
  },
};
