import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse } from '../types';
import apiClient from '../lib/api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    role: string;
    school_id?: number;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          // Create form data for OAuth2 password flow
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);

          const response = await apiClient.post('/auth/login', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const { access_token } = response.data;

          // Store token in localStorage
          localStorage.setItem('access_token', access_token);
          
          // Fetch user data
          const userResponse = await apiClient.get<User>('/auth/me');
          
          set({
            token: access_token,
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true });
          
          // Register user
          await apiClient.post('/auth/register', data);
          
          // Login with credentials
          const formData = new URLSearchParams();
          formData.append('username', data.email);
          formData.append('password', data.password);

          const loginResponse = await apiClient.post('/auth/login', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          const { access_token } = loginResponse.data;

          // Store token in localStorage
          localStorage.setItem('access_token', access_token);
          
          // Fetch user data
          const userResponse = await apiClient.get<User>('/auth/me');
          
          set({
            token: access_token,
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          const response = await apiClient.get<User>('/auth/me');
          set({
            user: response.data,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('access_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
