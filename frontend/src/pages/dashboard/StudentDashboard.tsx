import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
  Calendar,
  Loader2
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuthStore } from '../../store/authStore';
import { missionService } from '../../services/missionService';
import { badgeService } from '../../services/badgeService';
import { teamService } from '../../services/teamService';
import { statsService } from '../../services/statsService';

export const StudentDashboard = () => {
  const { user } = useAuthStore();

  // Fetch user's missions
  const { data: missions = [], isLoading: missionsLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: () => missionService.getMissions({ limit: 10 }),
  });

  // Fetch user's submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => missionService.getMySubmissions(),
  });

  // Fetch user's badges
  const { data: badges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ['my-badges'],
    queryFn: () => badgeService.getMyBadges(),
  });

  // Fetch team data
  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['my-team'],
    queryFn: () => teamService.getMyTeam(),
    retry: false, // Don't retry if user doesn't have a team
  });

  // Calculate stats from real data
  const stats = {
    totalPoints: user?.points || 0,
    completedMissions: submissions.filter(s => s.status === 'approved').length,
    badgesEarned: badges.length,
    currentRank: 3, // This would come from leaderboard API
    level: user?.level || 1,
    pointsToNextLevel: Math.max(0, ((user?.level || 1) * 1000) - (user?.points || 0)),
    teamRank: 2, // This would come from team stats
    streak: 7, // This would come from user activity tracking
  };

  // Get recent completed missions
  const recentActivities = submissions
    .filter(s => s.status === 'approved')
    .slice(0, 3)
    .map(submission => ({
      id: submission.id,
      type: 'mission' as const,
      title: submission.mission?.title || 'Mission',
      points: submission.points_awarded || 0,
      time: new Date(submission.reviewed_at || submission.submitted_at).toLocaleDateString('fr-FR'),
    }));

  // Get recently earned badges
  const recentBadges = badges.slice(0, 2).map(userBadge => ({
    id: userBadge.id,
    type: 'badge' as const,
    title: `Nouveau Badge: ${userBadge.badge?.name}`,
    time: new Date(userBadge.earned_at).toLocaleDateString('fr-FR'),
  }));

  // Combine activities
  const allActivities = [...recentActivities, ...recentBadges]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  // Get upcoming missions (active missions not yet submitted)
  const submittedMissionIds = new Set(submissions.map(s => s.mission_id));
  const upcomingMissions = missions
    .filter(mission => mission.is_active && !submittedMissionIds.has(mission.id))
    .slice(0, 3)
    .map(mission => ({
      id: mission.id,
      title: mission.title,
      difficulty: mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1),
      points: mission.points,
      deadline: mission.deadline 
        ? `${Math.ceil((new Date(mission.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jours`
        : 'Pas de deadline',
    }));

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

  const isLoading = missionsLoading || submissionsLoading || badgesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

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
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
              <Flame className="w-5 h-5 text-orange-300" />
              <span className="font-bold">{stats.streak} jours de série!</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">Niveau {stats.level}</span>
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
          subtitle={`${stats.pointsToNextLevel} pour le prochain niveau`}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Missions Complétées"
          value={stats.completedMissions}
          icon={Target}
          subtitle="Ce mois-ci"
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
          value={`#${stats.teamRank}`}
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
            <span className="text-3xl font-extrabold text-green-600">Niveau {stats.level}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
              <span>{stats.totalPoints} points</span>
              <span>{stats.totalPoints + stats.pointsToNextLevel} points</span>
            </div>
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.totalPoints / (stats.totalPoints + stats.pointsToNextLevel)) * 100}%` }}
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

          <p className="text-gray-600 text-sm">
            Plus que <span className="font-bold text-green-600">{stats.pointsToNextLevel} points</span> pour atteindre le niveau {stats.level + 1}!
          </p>

          {/* Recent Activities */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Activités Récentes
            </h3>
            <div className="space-y-3">
              {allActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
              ) : (
                allActivities.map((activity) => (
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
                    {'points' in activity && activity.points && (
                      <span className="font-bold text-green-600">+{activity.points}</span>
                    )}
                  </motion.div>
                ))
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
                    mission.difficulty === 'Facile' 
                      ? 'bg-green-100 text-green-700'
                      : mission.difficulty === 'Moyen'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {mission.difficulty}
                  </span>
                  <span className="font-bold text-blue-600">+{mission.points} pts</span>
                </div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date limite: {mission.deadline}
                </p>
              </motion.div>
            ))}
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
