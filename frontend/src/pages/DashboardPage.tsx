import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { StudentDashboard } from './dashboard/StudentDashboard';
import { TeacherDashboard } from './dashboard/TeacherDashboard';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Render different dashboards based on user role
  if (user?.role === UserRole.STUDENT) {
    return <StudentDashboard />;
  }

  if (user?.role === UserRole.TEACHER) {
    return <TeacherDashboard />;
  }

  // Fallback
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord</h1>
      <div className="bg-white rounded-lg shadow-card p-6">
        <p className="text-gray-600">
          Bienvenue sur la plateforme NIRD!
        </p>
      </div>
    </div>
  );
};
