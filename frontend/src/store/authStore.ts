import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authService } from '../services/authService';

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
    full_name: string;
    role: string;
    school_name?: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  devLogin: (role: string) => void;
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
          
          const response = await authService.login({ email, password });
          const { access_token, user } = response;

          // Store token in localStorage
          localStorage.setItem('access_token', access_token);
          
          set({
            token: access_token,
            user,
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
          
          const response = await authService.register(data);
          const { access_token, user } = response;

          // Store token in localStorage
          localStorage.setItem('access_token', access_token);
          
          set({
            token: access_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('access_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
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
          const user = await authService.getMe();
          set({
            user,
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

      devLogin: (role: string) => {
        // Mock user for development without backend
        const mockUser: User = {
          id: 1,
          email: `dev-${role.toLowerCase()}@nird.com`,
          full_name: role === 'student' ? 'Étudiant Dev' : role === 'teacher' ? 'Enseignant Dev' : 'Admin Dev',
          role: role as any,
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          profile_image: null,
        };

        const mockToken = 'dev-mock-token-' + Date.now();
        
        localStorage.setItem('access_token', mockToken);
        
        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
          isLoading: false,
        });
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
