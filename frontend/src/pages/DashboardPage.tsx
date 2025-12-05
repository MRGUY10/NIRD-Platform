import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { StudentDashboard } from './dashboard/StudentDashboard';
import { TeacherDashboard } from './dashboard/TeacherDashboard';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  // Render different dashboards based on user role
  if (user?.role === UserRole.STUDENT) {
    return <StudentDashboard />;
  }

  if (user?.role === UserRole.TEACHER) {
    return <TeacherDashboard />;
  }

  // Admin dashboard - placeholder for now
  if (user?.role === UserRole.ADMIN) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord Admin</h1>
        <div className="bg-white rounded-lg shadow-card p-6">
          <p className="text-gray-600">
            Le tableau de bord administrateur sera implémenté dans une phase ultérieure.
          </p>
        </div>
      </div>
    );
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
