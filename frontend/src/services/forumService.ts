import apiClient, { getErrorMessage } from '../lib/api-client';

export interface ForumAuthorSummary {
  id: number;
  username: string;
  full_name: string;
  avatar_url?: string | null;
  role: 'student' | 'teacher' | 'admin';
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  category_id?: number | null;
  author_id: number;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  created_at: string;
  updated_at?: string | null;
  author?: ForumAuthorSummary | null;
  comments_count?: number;
}

export interface CommentWithAuthor {
  id: number;
  content: string;
  author_id: number;
  forum_post_id: number;
  parent_comment_id?: number | null;
  created_at: string;
  updated_at?: string | null;
  author?: ForumAuthorSummary | null;
  replies?: CommentWithAuthor[];
}

export interface ListPostsParams {
  skip?: number;
  limit?: number;
  category_id?: number;
  search?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  category_id?: number;
}

export interface CreateCommentInput {
  content: string;
  parent_comment_id?: number;
}

export const forumService = {
  async listPosts(params: ListPostsParams = {}): Promise<ForumPost[]> {
    try {
      const { data } = await apiClient.get<ForumPost[]>('/forum/posts', { params });
      return data;
    } catch (err) {
      console.error('listPosts error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async getPost(postId: number): Promise<ForumPost> {
    try {
      const { data } = await apiClient.get<ForumPost>(`/forum/posts/${postId}`);
      return data;
    } catch (err) {
      console.error('getPost error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async getComments(postId: number): Promise<CommentWithAuthor[]> {
    try {
      const { data } = await apiClient.get<CommentWithAuthor[]>(`/forum/posts/${postId}/comments`);
      return data;
    } catch (err) {
      console.error('getComments error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async createPost(input: CreatePostInput): Promise<ForumPost> {
    try {
      const { data } = await apiClient.post<ForumPost>('/forum/posts', input);
      return data;
    } catch (err) {
      console.error('createPost error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async deletePost(postId: number): Promise<void> {
    try {
      await apiClient.delete(`/forum/posts/${postId}`);
    } catch (err) {
      console.error('deletePost error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async updatePost(postId: number, input: Partial<CreatePostInput> & { is_pinned?: boolean; is_locked?: boolean; }): Promise<ForumPost> {
    try {
      const { data } = await apiClient.put<ForumPost>(`/forum/posts/${postId}`, input);
      return data;
    } catch (err) {
      console.error('updatePost error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async createComment(postId: number, input: CreateCommentInput): Promise<CommentWithAuthor> {
    try {
      const { data } = await apiClient.post<CommentWithAuthor>(`/forum/posts/${postId}/comments`, input);
      return data;
    } catch (err) {
      console.error('createComment error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async updateComment(commentId: number, content: string): Promise<CommentWithAuthor> {
    try {
      const { data } = await apiClient.put<CommentWithAuthor>(`/forum/comments/${commentId}`, { content });
      return data;
    } catch (err) {
      console.error('updateComment error:', err);
      throw new Error(getErrorMessage(err));
    }
  },

  async deleteComment(commentId: number): Promise<void> {
    try {
      await apiClient.delete(`/forum/comments/${commentId}`);
    } catch (err) {
      console.error('deleteComment error:', err);
      throw new Error(getErrorMessage(err));
    }
  },
};
