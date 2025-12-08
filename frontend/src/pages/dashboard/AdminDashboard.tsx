import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, Shield, BookOpen, Award, MessageSquare, 
  TrendingUp, AlertCircle, CheckCircle, Clock, Target
} from 'lucide-react';
import { adminService } from '../../services/adminService';

interface DashboardStats {
  total_users: number;
  total_teams: number;
  total_missions: number;
  total_submissions: number;
  pending_submissions: number;
  active_users_today: number;
  new_users_today: number;
  new_users_this_week: number;
  missions_completed_today: number;
  total_resources: number;
  total_forum_posts: number;
  users_by_role: Record<string, number>;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats?.new_users_today || 0} aujourd'hui`,
    },
    {
      title: 'Équipes Actives',
      value: stats?.total_teams || 0,
      icon: Shield,
      color: 'bg-purple-500',
      change: `${stats?.active_users_today || 0} actifs`,
    },
    {
      title: 'Missions',
      value: stats?.total_missions || 0,
      icon: Target,
      color: 'bg-green-500',
      change: `${stats?.missions_completed_today || 0} complétées`,
    },
    {
      title: 'Soumissions en Attente',
      value: stats?.pending_submissions || 0,
      icon: Clock,
      color: 'bg-orange-500',
      change: 'À réviser',
    },
    {
      title: 'Ressources',
      value: stats?.total_resources || 0,
      icon: BookOpen,
      color: 'bg-indigo-500',
      change: 'Disponibles',
    },
    {
      title: 'Discussions Forum',
      value: stats?.total_forum_posts || 0,
      icon: MessageSquare,
      color: 'bg-pink-500',
      change: 'Publications',
    },
  ];

  const roleStats = stats?.users_by_role || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d'ensemble de la plateforme NIRD
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Système opérationnel</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Répartition des Utilisateurs
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Étudiants</span>
                <span className="text-sm font-bold text-gray-900">
                  {roleStats.STUDENT || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${((roleStats.STUDENT || 0) / (stats?.total_users || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Enseignants</span>
                <span className="text-sm font-bold text-gray-900">
                  {roleStats.TEACHER || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${((roleStats.TEACHER || 0) / (stats?.total_users || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Administrateurs</span>
                <span className="text-sm font-bold text-gray-900">
                  {roleStats.ADMIN || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${((roleStats.ADMIN || 0) / (stats?.total_users || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Actions Rapides
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/users"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Gérer les Utilisateurs</span>
              </div>
              <span className="text-sm text-gray-500">{stats?.total_users || 0}</span>
            </a>
            <a
              href="/admin/submissions"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium text-gray-900">Réviser Soumissions</span>
              </div>
              <span className="text-sm text-gray-500">{stats?.pending_submissions || 0}</span>
            </a>
            <a
              href="/missions"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Target className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Gérer les Missions</span>
              </div>
              <span className="text-sm text-gray-500">{stats?.total_missions || 0}</span>
            </a>
            <a
              href="/resources"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-indigo-600 mr-3" />
                <span className="font-medium text-gray-900">Gérer les Ressources</span>
              </div>
              <span className="text-sm text-gray-500">{stats?.total_resources || 0}</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Alert */}
      {stats && stats.pending_submissions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg"
        >
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-800">
                Attention requise
              </h3>
              <p className="mt-1 text-sm text-orange-700">
                Vous avez {stats.pending_submissions} soumission(s) en attente de révision.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
