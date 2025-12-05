import { motion } from 'framer-motion';
import { Users, Target, FileText, TrendingUp, Activity, Award, MessageSquare, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { statsService } from '../../services/statsService';

export default function AdminDashboardPage() {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminService.getDashboardStats(),
  });

  const { data: globalStats } = useQuery({
    queryKey: ['globalStats'],
    queryFn: () => statsService.getGlobalStats(),
  });

  const statsCards = [
    {
      title: 'Total Utilisateurs',
      value: dashboardStats?.total_users || 0,
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Équipes Actives',
      value: dashboardStats?.total_teams || 0,
      change: '+8%',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Missions Totales',
      value: dashboardStats?.total_missions || 0,
      change: '+15%',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Soumissions',
      value: dashboardStats?.total_submissions || 0,
      change: '+25%',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const activityCards = [
    {
      title: 'Posts de Forum',
      value: globalStats?.total_forum_posts || 0,
      icon: MessageSquare,
      color: 'text-pink-600',
    },
    {
      title: 'Ressources',
      value: globalStats?.total_resources || 0,
      icon: BookOpen,
      color: 'text-indigo-600',
    },
    {
      title: 'Badges Distribués',
      value: globalStats?.total_badges_earned || 0,
      icon: Award,
      color: 'text-yellow-600',
    },
    {
      title: 'Taux de Réussite',
      value: '87%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Tableau de Bord Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme NIRD</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className="text-sm font-bold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value.toLocaleString()}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-600" />
              Activité de la Plateforme
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {activityCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200"
                  >
                    <Icon className={`w-8 h-8 ${card.color} mb-2`} />
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-600">{card.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
            <div className="space-y-4">
              {[
                { action: 'Nouvelle mission créée', time: 'Il y a 5 min', color: 'bg-purple-100 text-purple-600' },
                { action: 'Utilisateur inscrit', time: 'Il y a 12 min', color: 'bg-blue-100 text-blue-600' },
                { action: 'Badge décerné', time: 'Il y a 23 min', color: 'bg-yellow-100 text-yellow-600' },
                { action: 'Équipe créée', time: 'Il y a 1 h', color: 'bg-green-100 text-green-600' },
                { action: 'Soumission validée', time: 'Il y a 2 h', color: 'bg-orange-100 text-orange-600' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Gérer Utilisateurs', icon: Users },
              { label: 'Créer Mission', icon: Target },
              { label: 'Voir Équipes', icon: Users },
              { label: 'Statistiques', icon: TrendingUp },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl p-4 transition-all flex flex-col items-center gap-2"
                >
                  <Icon className="w-8 h-8" />
                  <span className="text-sm font-bold">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
