import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Award,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const TeacherAnalyticsPage = () => {
  // Mock data - Analytics
  const analytics = {
    overview: {
      totalStudents: 8,
      activeStudents: 7,
      totalMissions: 6,
      activeMissions: 4,
      totalSubmissions: 165,
      pendingReviews: 5,
      completedSubmissions: 142,
      averageScore: 87,
    },
    trends: {
      studentsGrowth: +12,
      submissionsGrowth: +25,
      completionRate: +8,
      averageScoreChange: +5,
    },
    topStudents: [
      { name: 'Marie Dubois', points: 1850, missions: 24, level: 15, avatar: 'MD' },
      { name: 'Lucas Martin', points: 1720, missions: 22, level: 14, avatar: 'LM' },
      { name: 'Sophie Bernard', points: 1650, missions: 21, level: 13, avatar: 'SB' },
      { name: 'Thomas Petit', points: 1580, missions: 20, level: 13, avatar: 'TP' },
      { name: 'Emma Rousseau', points: 1450, missions: 19, level: 12, avatar: 'ER' },
    ],
    missionStats: [
      {
        title: 'Recycler 5 Téléphones Portables',
        submissions: 45,
        completed: 28,
        pending: 12,
        rejected: 5,
        completionRate: 62,
      },
      {
        title: 'Créer une Affiche de Sensibilisation',
        submissions: 32,
        completed: 20,
        pending: 8,
        rejected: 4,
        completionRate: 63,
      },
      {
        title: 'Organiser un Atelier de Réparation',
        submissions: 8,
        completed: 4,
        pending: 3,
        rejected: 1,
        completionRate: 50,
      },
      {
        title: 'Enquête sur les E-Déchets',
        submissions: 18,
        completed: 10,
        pending: 5,
        rejected: 3,
        completionRate: 56,
      },
    ],
    monthlyActivity: [
      { month: 'Août', submissions: 12 },
      { month: 'Sept', submissions: 28 },
      { month: 'Oct', submissions: 35 },
      { month: 'Nov', submissions: 42 },
      { month: 'Déc', submissions: 48 },
    ],
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Statistiques & Analyses</h1>
                <p className="text-gray-600 mt-1">
                  Vue d'ensemble des performances et tendances
                </p>
              </div>
            </div>
          </motion.div>

          {/* Overview Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{analytics.trends.studentsGrowth}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Étudiants Actifs</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.activeStudents}</p>
              <p className="text-xs text-gray-500 mt-1">sur {analytics.overview.totalStudents} total</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{analytics.trends.submissionsGrowth}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Soumissions Totales</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalSubmissions}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.overview.pendingReviews} en attente</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{analytics.trends.completionRate}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Taux de Complétion</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((analytics.overview.completedSubmissions / analytics.overview.totalSubmissions) * 100)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{analytics.overview.completedSubmissions} complétées</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{analytics.trends.averageScoreChange}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Score Moyen</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.averageScore}%</p>
              <p className="text-xs text-gray-500 mt-1">Performance globale</p>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Activity Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Activité Mensuelle</h3>
              <div className="space-y-4">
                {analytics.monthlyActivity.map((data, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{data.month}</span>
                      <span className="text-sm font-bold text-gray-900">{data.submissions} soumissions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                        style={{ width: `${(data.submissions / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Students */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top 5 Étudiants</h3>
              <div className="space-y-4">
                {analytics.topStudents.map((student, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {student.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-600">Niveau {student.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-purple-700">{student.points} pts</p>
                      <p className="text-xs text-gray-600">{student.missions} missions</p>
                    </div>
                    <div className="flex-shrink-0">
                      {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                      {index === 1 && <Trophy className="w-6 h-6 text-gray-400" />}
                      {index === 2 && <Trophy className="w-6 h-6 text-orange-600" />}
                      {index > 2 && <Award className="w-6 h-6 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mission Statistics */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Statistiques par Mission</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mission</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Soumissions</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Complétées</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">En Attente</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Rejetées</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Taux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.missionStats.map((mission, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{mission.title}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{mission.submissions}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                          {mission.completed}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                          {mission.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                          {mission.rejected}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${mission.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 min-w-[45px]">
                            {mission.completionRate}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Additional Insights */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <h3 className="text-xl font-bold">Progression</h3>
              </div>
              <p className="text-3xl font-bold mb-2">+25%</p>
              <p className="text-blue-100">d'augmentation des soumissions ce mois</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">Qualité</h3>
              </div>
              <p className="text-3xl font-bold mb-2">87%</p>
              <p className="text-green-100">de score moyen sur les soumissions</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8" />
                <h3 className="text-xl font-bold">Réactivité</h3>
              </div>
              <p className="text-3xl font-bold mb-2">5</p>
              <p className="text-purple-100">soumissions en attente de révision</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherAnalyticsPage;
