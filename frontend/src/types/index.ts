// API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  school_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// User Types
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  school_id?: number;
  points: number;
  level: number;
  profile_photo?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// School Types
export interface School {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
}

// Team Types
export interface Team {
  id: number;
  name: string;
  school_id: number;
  teacher_id: number;
  description?: string;
  team_code: string;
  max_members: number;
  is_active: boolean;
  created_at: string;
  school?: School;
  teacher?: User;
  members?: TeamMember[];
  member_count?: number;
  total_points?: number;
}

export interface TeamMember {
  id: number;
  team_id: number;
  student_id: number;
  joined_at: string;
  student?: User;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

// Mission Types
export enum MissionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum MissionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  category_id: number;
  difficulty: MissionDifficulty;
  points: number;
  instructions?: string;
  deadline?: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  submission_count?: number;
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface MissionSubmission {
  id: number;
  mission_id: number;
  student_id: number;
  team_id?: number;
  submission_text?: string;
  photo_url?: string;
  file_url?: string;
  status: SubmissionStatus;
  feedback?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  points_awarded?: number;
  submitted_at: string;
  mission?: Mission;
  student?: User;
  team?: Team;
  reviewer?: User;
}

// Badge Types
export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  rarity: BadgeRarity;
  criteria_description?: string;
  icon_url?: string;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  earned_at: string;
  badge?: Badge;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  user_id?: number;
  team_id?: number;
  name: string;
  points: number;
  level?: number;
  profile_photo?: string;
  school_name?: string;
  badge_count?: number;
}

// Resource Types
export interface Resource {
  id: number;
  title: string;
  description?: string;
  file_url?: string;
  resource_type: string;
  category_id?: number;
  uploaded_by: number;
  is_public: boolean;
  download_count: number;
  created_at: string;
  category?: Category;
  uploader?: User;
}

// Forum Types
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  category_id?: number;
  author_id: number;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: User;
  category?: Category;
  comment_count?: number;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author?: User;
}

// Notification Types
export enum NotificationType {
  MISSION_ASSIGNED = 'mission_assigned',
  SUBMISSION_REVIEWED = 'submission_reviewed',
  BADGE_EARNED = 'badge_earned',
  TEAM_INVITATION = 'team_invitation',
  LEVEL_UP = 'level_up',
  NEW_COMMENT = 'new_comment',
  MISSION_DEADLINE = 'mission_deadline',
  LEADERBOARD_UPDATE = 'leaderboard_update',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

// Analytics Types
export interface DashboardStats {
  total_points: number;
  completed_missions: number;
  badges_earned: number;
  current_rank: number;
  level: number;
  points_to_next_level: number;
}

export interface AdminStats {
  total_users: number;
  total_teams: number;
  total_missions: number;
  total_submissions: number;
  pending_submissions: number;
  active_users_today: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    path?: string;
  };
}
