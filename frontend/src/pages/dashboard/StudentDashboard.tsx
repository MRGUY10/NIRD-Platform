import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  Flame,
  Star,
  Zap,
  BookOpen,
  Calendar
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useMemo, useState } from 'react';
import { statsService } from '../../services/statsService';
import { missionService } from '../../services/missionService';
import { badgeService } from '../../services/badgeService';
import { teamService } from '../../services/teamService';

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string>('Mon équipe');
  const [teamRank, setTeamRank] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [completedMissions, setCompletedMissions] = useState<number>(0);
  const [badgesEarned, setBadgesEarned] = useState<number>(0);
  const [upcomingMissions, setUpcomingMissions] = useState<Array<{ id: number; title: string; difficulty: string; points: number; deadline?: string }>>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{ id: number; type: 'mission' | 'badge'; title: string; points?: number; time: string }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Get my team (student)
        try {
          const myTeam = await teamService.getMyTeam();
          if (!mounted) return;
          setTeamId(myTeam.id);
          setTeamName(myTeam.name);
        } catch (e) {
          // Not in a team yet or other error
        }

        // Fetch badges
        try {
          const myBadges = await badgeService.getMyBadges();
          if (!mounted) return;
          setBadgesEarned(myBadges.length);
        } catch (e) {
          // ignore badges error
        }

        // Active missions (limit 4)
        try {
          const missions = await missionService.listMissions({ is_active: true, limit: 4 });
          if (!mounted) return;
          setUpcomingMissions(
            missions.map((m) => ({ id: m.id, title: m.title, difficulty: m.difficulty, points: m.points }))
          );
        } catch (e) {
          // ignore
        }

        // Recent activities: my team submissions
        try {
          const subs = await missionService.getMySubmissions();
          if (!mounted) return;
          const items = subs.slice(0, 5).map((s) => ({
            id: s.id,
            type: 'mission' as const,
            title: `Soumission #${s.id}`,
            points: s.mission?.points ?? 0,
            time: new Date(s.submitted_at).toLocaleString('fr-FR'),
          }));
          setRecentActivities(items);
        } catch (e) {
          // ignore
        }

        // Team stats if team exists
        if (teamId) {
          try {
            const tstats = await statsService.getTeam(teamId);
            if (!mounted) return;
            setTotalPoints(tstats.total_points);
            setCompletedMissions(tstats.total_missions_completed);
            setTeamRank(tstats.current_rank ?? null);
          } catch (e) {
            // ignore
          }
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Erreur lors du chargement du tableau de bord');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [teamId]);

  const stats = useMemo(() => ({
    totalPoints,
    completedMissions,
    badgesEarned,
    currentRank: teamRank ?? 0,
    level: 0,
    pointsToNextLevel: 0,
    teamRank: teamRank ?? 0,
    streak: 0,
  }), [totalPoints, completedMissions, badgesEarned, teamRank]);

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
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">
            Bienvenue, {user?.full_name || 'Étudiant'}! 🎉
          </h1>
          <p className="text-xl text-green-100 mb-6">
            Vous êtes en feu! Continuez votre parcours écologique.
          </p>
          
          <div className="flex items-center gap-4">
            {teamName && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                <Users className="w-5 h-5 text-orange-300" />
                <span className="font-bold">{teamName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">Badges {stats.badgesEarned}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Points Totaux"
          value={stats.totalPoints.toLocaleString()}
          icon={Trophy}
          subtitle={teamRank ? `Rang équipe #${teamRank}` : 'Points cumulés de l\'équipe'}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Missions Complétées"
          value={stats.completedMissions}
          icon={Target}
          subtitle="Soumissions approuvées (équipe)"
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Badges Gagnés"
          value={stats.badgesEarned}
          icon={Award}
          subtitle="Collection en croissance"
          color="purple"
        />
        <StatCard
          title="Rang dans l'Équipe"
          value={teamRank ? `#${teamRank}` : '-'}
          icon={Users}
          subtitle="Top contributeur"
          color="orange"
        />
      </motion.div>

      {/* Progress and Activity Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Level Progress */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Progression du Niveau
            </h2>
            <span className="text-3xl font-extrabold text-green-600">Points {stats.totalPoints}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
              <span>{stats.totalPoints} points</span>
              <span>{stats.totalPoints} points</span>
            </div>
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `100%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {error && (<p className="text-red-600 text-sm">{error}</p>)}

          {/* Recent Activities */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Activités Récentes
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'mission' 
                        ? 'bg-green-100' 
                        : 'bg-purple-100'
                    }`}>
                      {activity.type === 'mission' ? (
                        <Target className="w-4 h-4 text-green-600" />
                      ) : (
                        <Award className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.points && (
                    <span className="font-bold text-green-600">+{activity.points}</span>
                  )}
                </motion.div>
              ))}
              {recentActivities.length === 0 && !loading && (
                <div className="text-sm text-gray-500">Aucune activité récente.</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Missions */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Missions Disponibles
          </h2>
          <div className="space-y-4">
            {upcomingMissions.map((mission) => (
              <motion.div
                key={mission.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
              >
                <h3 className="font-bold text-gray-900 mb-2">{mission.title}</h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={`px-2 py-1 rounded-lg font-semibold ${
                    mission.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-700'
                      : mission.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {mission.difficulty}
                  </span>
                  <span className="font-bold text-blue-600">+{mission.points} pts</span>
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Mission disponible
                </p>
              </motion.div>
            ))}
            {upcomingMissions.length === 0 && !loading && (
              <div className="text-sm text-gray-500">Aucune mission disponible.</div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Voir Toutes les Missions
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
