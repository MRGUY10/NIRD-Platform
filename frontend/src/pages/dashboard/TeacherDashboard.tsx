import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  Target,
  AlertCircle,
  BarChart3,
  FileText
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { statsService } from '../../services/statsService';
import { submissionService } from '../../services/missionService';

export const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [activeStudents, setActiveStudents] = useState<number>(0);
  const [pendingSubmissions, setPendingSubmissions] = useState<number>(0);
  const [totalMissions, setTotalMissions] = useState<number>(0);
  const [pendingReviews, setPendingReviews] = useState<Array<{ id: number; student: string; team: string; mission: string; submitted: string }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ id: number; action: string; student: string; time: string }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Global stats
        try {
          const g = await statsService.getGlobal();
          if (!mounted) return;
          setTotalStudents(g.total_users);
          setActiveStudents(g.active_users_last_30_days);
          setTotalMissions(g.total_missions);
        } catch (e: any) {
          if (mounted) setError(e.message || 'Erreur de statistiques');
        }

        // Pending submissions
        try {
          const subs = await submissionService.listSubmissions({ status: 'PENDING', limit: 10 });
          if (!mounted) return;
          setPendingSubmissions(subs.length);
          setPendingReviews(
            subs.map((s) => ({
              id: s.id,
              student: `Utilisateur #${s.submitted_by}`,
              team: s.team?.name ? s.team.name : `Équipe #${s.team_id}`,
              mission: s.mission?.title ? s.mission.title : `Mission #${s.mission_id}`,
              submitted: new Date(s.submitted_at).toLocaleString('fr-FR'),
            }))
          );
        } catch (e) {
          // ignore
        }

        // Recent submissions (any status)
        try {
          const recent = await submissionService.listSubmissions({ limit: 5 });
          if (!mounted) return;
          setRecentActivity(
            recent.map((s) => ({
              id: s.id,
              action: `Soumission ${s.status.toLowerCase()}`,
              student: `Utilisateur #${s.submitted_by}`,
              time: new Date(s.submitted_at).toLocaleString('fr-FR'),
            }))
          );
        } catch (e) {
          // ignore
        }
      } catch (e: any) {
        if (mounted) setError(e.message || 'Erreur du tableau de bord');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">
            Bienvenue, {user?.full_name || 'Enseignant'}! 👨‍🏫
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Votre tableau de bord pour gérer et suivre les progrès de vos étudiants.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">{pendingSubmissions} soumissions en attente</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-bold">{totalMissions} missions listées</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs Totaux"
          value={totalStudents}
          icon={Users}
          subtitle={`${activeStudents} actifs (30 jours)`}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Soumissions en Attente"
          value={pendingSubmissions}
          icon={Clock}
          subtitle="À réviser"
          color="orange"
        />
        <StatCard
          title="Missions Créées"
          value={totalMissions}
          icon={Target}
          subtitle="Total disponibles"
          color="purple"
        />
        <StatCard
          title="Taux de Réussite"
          value={`-`}
          icon={TrendingUp}
          subtitle="Indisponible"
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              Soumissions à Réviser
            </h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
              {pendingSubmissions} en attente
            </span>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ scale: 1.01, x: 4 }}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{review.mission}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Par <span className="font-semibold">{review.student}</span> - {review.team}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Soumis {review.submitted}
                </p>
              </motion.div>
            ))}
            {pendingReviews.length === 0 && !loading && (
              <div className="text-sm text-gray-500">Aucune soumission en attente.</div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Voir Toutes les Soumissions
          </motion.button>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Activité Récente
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.student}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </motion.div>
              ))}
              {recentActivity.length === 0 && !loading && (
                <div className="text-sm text-gray-500">Aucune activité récente.</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Top Students */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Top Étudiants
          </h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">Classement étudiants indisponible.</div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Voir Tous les Étudiants
          </motion.button>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-3">Statistiques Rapides</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Utilisateurs actifs (30j):</span>
                <span className="font-bold text-blue-600">{activeStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Missions listées:</span>
                <span className="font-bold text-green-600">{totalMissions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Soumissions en attente:</span>
                <span className="font-bold text-purple-600">{pendingSubmissions}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
