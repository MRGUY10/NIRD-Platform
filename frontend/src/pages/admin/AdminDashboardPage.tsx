import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  GraduationCap,
  UsersRound,
  Target,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
} from 'lucide-react';

const AdminDashboardPage = () => {
  // Mock data - Admin Dashboard Stats
  const stats = {
    users: {
      total: 892,
      newToday: 12,
      newThisWeek: 47,
      activeToday: 234,
      byRole: {
        student: 850,
        teacher: 38,
        admin: 4,
      },
    },
    teams: {
      total: 156,
      active: 142,
      withoutMembers: 3,
    },
    missions: {
      total: 24,
      active: 18,
      pendingSubmissions: 67,
      approvedToday: 15,
    },
    content: {
      resources: 142,
      forumPosts: 328,
      comments: 1567,
    },
    engagement: {
      avgMissionsPerTeam: 8.2,
      avgTeamSize: 5.7,
    },
  };

  const recentActivity = [
    { id: 1, type: 'user', message: 'Marie Dubois a rejoint la plateforme', time: '5 min ago', icon: UserPlus, color: 'blue' },
    { id: 2, type: 'mission', message: '15 nouvelles soumissions approuvées', time: '23 min ago', icon: CheckCircle, color: 'green' },
    { id: 3, type: 'team', message: 'Équipe "Les Éco-Warriors" créée', time: '1 heure ago', icon: UsersRound, color: 'purple' },
    { id: 4, type: 'resource', message: '3 nouvelles ressources publiées', time: '2 heures ago', icon: FileText, color: 'orange' },
    { id: 5, type: 'forum', message: '42 nouveaux posts dans le forum', time: '3 heures ago', icon: MessageSquare, color: 'pink' },
  ];

  const topSchools = [
    { name: 'Lycée Victor Hugo', teams: 24, students: 156, points: 45600 },
    { name: 'Collège Marie Curie', teams: 18, students: 108, points: 32400 },
    { name: 'Lycée Jules Ferry', teams: 15, students: 95, points: 28500 },
    { name: 'Collège Jean Moulin', teams: 12, students: 78, points: 23400 },
    { name: 'Lycée Pasteur', teams: 10, students: 67, points: 20100 },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Tableau de Bord Admin</h1>
                <p className="text-gray-600 mt-1">
                  Vue d'ensemble de la plateforme NIRD
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Users */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{stats.users.newThisWeek}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Utilisateurs Totaux</p>
              <p className="text-3xl font-bold text-gray-900">{stats.users.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.users.newToday} nouveaux aujourd'hui
              </p>
            </div>

            {/* Active Today */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Actifs Aujourd'hui</p>
              <p className="text-3xl font-bold text-gray-900">{stats.users.activeToday}</p>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.users.activeToday / stats.users.total) * 100)}% du total
              </p>
            </div>

            {/* Teams */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UsersRound className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">{stats.teams.active} actives</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Équipes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.teams.total}</p>
              <p className="text-xs text-gray-500 mt-2">
                ~{stats.engagement.avgTeamSize} membres / équipe
              </p>
            </div>

            {/* Pending Submissions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs text-orange-600 font-semibold">Action requise</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Soumissions en Attente</p>
              <p className="text-3xl font-bold text-gray-900">{stats.missions.pendingSubmissions}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.missions.approvedToday} approuvées aujourd'hui
              </p>
            </div>
          </motion.div>

          {/* User Breakdown */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8" />
                <h3 className="text-xl font-bold">Étudiants</h3>
              </div>
              <p className="text-4xl font-bold mb-2">{stats.users.byRole.student.toLocaleString()}</p>
              <p className="text-blue-100">
                {Math.round((stats.users.byRole.student / stats.users.total) * 100)}% des utilisateurs
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8" />
                <h3 className="text-xl font-bold">Enseignants</h3>
              </div>
              <p className="text-4xl font-bold mb-2">{stats.users.byRole.teacher}</p>
              <p className="text-purple-100">
                {Math.round((stats.users.byRole.teacher / stats.users.total) * 100)}% des utilisateurs
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8" />
                <h3 className="text-xl font-bold">Administrateurs</h3>
              </div>
              <p className="text-4xl font-bold mb-2">{stats.users.byRole.admin}</p>
              <p className="text-indigo-100">
                Gestion de la plateforme
              </p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Missions & Content Stats */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                Missions & Contenu
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Missions Actives</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.missions.active}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Total Missions</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{stats.missions.total}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Ressources</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.content.resources}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Posts Forum</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{stats.content.forumPosts}</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-600" />
                Activité Récente
              </h3>
              
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  const colorClasses = {
                    blue: 'bg-blue-100 text-blue-600',
                    green: 'bg-green-100 text-green-600',
                    purple: 'bg-purple-100 text-purple-600',
                    orange: 'bg-orange-100 text-orange-600',
                    pink: 'bg-pink-100 text-pink-600',
                  };
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`p-2 rounded-lg ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Top Schools */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Top 5 Établissements
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rang</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">École</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Équipes</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Étudiants</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topSchools.map((school, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{school.name}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          <UsersRound className="w-4 h-4" />
                          {school.teams}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          <GraduationCap className="w-4 h-4" />
                          {school.students}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-indigo-600">{school.points.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${(school.points / 50000) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 min-w-[45px]">
                            {Math.round((school.points / 50000) * 100)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Engagement Metrics */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" />
                <h3 className="text-xl font-bold">Missions par Équipe</h3>
              </div>
              <p className="text-4xl font-bold mb-2">{stats.engagement.avgMissionsPerTeam}</p>
              <p className="text-green-100">Moyenne de missions complétées</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8" />
                <h3 className="text-xl font-bold">Commentaires</h3>
              </div>
              <p className="text-4xl font-bold mb-2">{stats.content.comments.toLocaleString()}</p>
              <p className="text-orange-100">Engagement communautaire actif</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
