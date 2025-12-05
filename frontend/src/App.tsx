import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Layouts
import { AuthLayout } from './components/layouts/AuthLayout';
import { MainLayout } from './components/layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage';
import { MissionsPage } from './pages/missions/MissionsPage';
import { TeamPage } from './pages/team/TeamPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import BadgesPage from './pages/badges/BadgesPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import ForumPage from './pages/forum/ForumPage';
import TeacherMissionsPage from './pages/teacher/TeacherMissionsPage';
import TeacherStudentsPage from './pages/teacher/TeacherStudentsPage';
import TeacherSubmissionsPage from './pages/teacher/TeacherSubmissionsPage';
import TeacherAnalyticsPage from './pages/teacher/TeacherAnalyticsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSchoolsPage from './pages/admin/AdminSchoolsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Student Routes */}
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/forum" element={<ForumPage />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher/missions" element={<TeacherMissionsPage />} />
            <Route path="/teacher/students" element={<TeacherStudentsPage />} />
            <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
            <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/schools" element={<AdminSchoolsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
