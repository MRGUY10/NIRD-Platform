import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Target,
  Award,
  Star,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Types
interface TeamRanking {
  id: number;
  name: string;
  school: string;
  points: number;
  missionsCompleted: number;
  members: number;
  rank: number;
  rankChange: number; // positive = up, negative = down, 0 = same
  badge?: string;
}

interface StudentRanking {
  id: number;
  name: string;
  school: string;
  team: string;
  points: number;
  missionsCompleted: number;
  rank: number;
  rankChange: number;
  level: number;
  avatar: string;
}

interface GlobalStats {
  totalTeams: number;
  totalStudents: number;
  totalPoints: number;
  totalMissions: number;
}

type LeaderboardType = 'teams' | 'students';
type TimeFilter = 'all' | 'month' | 'week';

const LeaderboardPage = () => {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('teams');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');

  // Mock data - Global Stats
  const globalStats: GlobalStats = {
    totalTeams: 156,
    totalStudents: 892,
    totalPoints: 445680,
    totalMissions: 1247,
  };

  // Mock data - Team Rankings
  const teamRankings: TeamRanking[] = [
    {
      id: 1,
      name: 'Éco-Warriors',
      school: 'Lycée Victor Hugo',
      points: 4850,
      missionsCompleted: 38,
      members: 5,
      rank: 1,
      rankChange: 2,
      badge: 'champion',
    },
    {
      id: 2,
      name: 'Green Guardians',
      school: 'Collège Jean Moulin',
      points: 4620,
      missionsCompleted: 36,
      members: 4,
      rank: 2,
      rankChange: -1,
    },
    {
      id: 3,
      name: 'Équipe Alpha',
      school: 'Lycée Marie Curie',
      points: 4250,
      missionsCompleted: 32,
      members: 3,
      rank: 3,
      rankChange: 1,
    },
    {
      id: 4,
      name: 'Les Recycleurs',
      school: 'Lycée Victor Hugo',
      points: 3980,
      missionsCompleted: 30,
      members: 5,
      rank: 4,
      rankChange: 0,
    },
    {
      id: 5,
      name: 'Cyber Éco',
      school: 'Collège Pasteur',
      points: 3750,
      missionsCompleted: 28,
      members: 4,
      rank: 5,
      rankChange: -2,
    },
    {
      id: 6,
      name: 'Tech Green',
      school: 'Lycée Marie Curie',
      points: 3520,
      missionsCompleted: 26,
      members: 4,
      rank: 6,
      rankChange: 1,
    },
    {
      id: 7,
      name: 'E-Waste Heroes',
      school: 'Collège Jean Moulin',
      points: 3350,
      missionsCompleted: 25,
      members: 3,
      rank: 7,
      rankChange: 0,
    },
    {
      id: 8,
      name: 'Digital Eco',
      school: 'Lycée Victor Hugo',
      points: 3180,
      missionsCompleted: 24,
      members: 5,
      rank: 8,
      rankChange: 0,
    },
  ];

  // Mock data - Student Rankings
  const studentRankings: StudentRanking[] = [
    {
      id: 1,
      name: 'Marie Dubois',
      school: 'Lycée Victor Hugo',
      team: 'Éco-Warriors',
      points: 1850,
      missionsCompleted: 24,
      rank: 1,
      rankChange: 1,
      level: 15,
      avatar: 'MD',
    },
    {
      id: 2,
      name: 'Lucas Martin',
      school: 'Collège Jean Moulin',
      team: 'Green Guardians',
      points: 1720,
      missionsCompleted: 22,
      rank: 2,
      rankChange: -1,
      level: 14,
      avatar: 'LM',
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      school: 'Lycée Marie Curie',
      team: 'Équipe Alpha',
      points: 1650,
      missionsCompleted: 21,
      rank: 3,
      rankChange: 2,
      level: 13,
      avatar: 'SB',
    },
    {
      id: 4,
      name: 'Thomas Petit',
      school: 'Lycée Victor Hugo',
      team: 'Les Recycleurs',
      points: 1580,
      missionsCompleted: 20,
      rank: 4,
      rankChange: 0,
      level: 13,
      avatar: 'TP',
    },
    {
      id: 5,
      name: 'Emma Rousseau',
      school: 'Collège Pasteur',
      team: 'Cyber Éco',
      points: 1450,
      missionsCompleted: 19,
      rank: 5,
      rankChange: 1,
      level: 12,
      avatar: 'ER',
    },
    {
      id: 6,
      name: 'Hugo Leroy',
      school: 'Lycée Marie Curie',
      team: 'Tech Green',
      points: 1380,
      missionsCompleted: 18,
      rank: 6,
      rankChange: -2,
      level: 12,
      avatar: 'HL',
    },
    {
      id: 7,
      name: 'Chloé Moreau',
      school: 'Collège Jean Moulin',
      team: 'E-Waste Heroes',
      points: 1320,
      missionsCompleted: 17,
      rank: 7,
      rankChange: 0,
      level: 11,
      avatar: 'CM',
    },
    {
      id: 8,
      name: 'Alexandre Simon',
      school: 'Lycée Victor Hugo',
      team: 'Digital Eco',
      points: 1250,
      missionsCompleted: 16,
      rank: 8,
      rankChange: 1,
      level: 11,
      avatar: 'AS',
    },
  ];

  // Get unique schools for filter
  const schools = ['all', ...Array.from(new Set(teamRankings.map((t) => t.school)))];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Render rank badge
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg">
          <Crown className="w-7 h-7 text-white" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-lg">
          <Medal className="w-7 h-7 text-white" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg">
          <Award className="w-7 h-7 text-white" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
          <span className="text-lg font-bold text-gray-700">#{rank}</span>
        </div>
      );
    }
  };

  // Render rank change indicator
  const getRankChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ChevronUp className="w-4 h-4" />
          <span className="text-sm font-semibold">+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm font-semibold">{change}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-400">
          <span className="text-sm">—</span>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Classement</h1>
                <p className="text-gray-600 mt-1">
                  Découvrez les meilleurs équipes et étudiants
                </p>
              </div>
            </div>
          </motion.div>

          {/* Global Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Équipes Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.totalTeams}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Étudiants Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {globalStats.totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Missions Complétées</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.totalMissions}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Leaderboard Type Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLeaderboardType('teams')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    leaderboardType === 'teams'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Équipes
                </button>
                <button
                  onClick={() => setLeaderboardType('students')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    leaderboardType === 'students'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Étudiants
                </button>
              </div>

              {/* Time Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tout le temps
                </button>
                <button
                  onClick={() => setTimeFilter('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === 'month'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Ce mois
                </button>
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === 'week'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Cette semaine
                </button>
              </div>

              {/* School Filter */}
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school === 'all' ? 'Toutes les écoles' : school}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Leaderboard Content */}
          <AnimatePresence mode="wait">
            {leaderboardType === 'teams' ? (
              <motion.div
                key="teams"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top 3 Teams - Podium */}
                <motion.div variants={itemVariants} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Top 3 Équipes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {teamRankings.slice(0, 3).map((team, index) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative bg-gradient-to-br ${
                          team.rank === 1
                            ? 'from-yellow-100 to-yellow-200 border-yellow-400'
                            : team.rank === 2
                            ? 'from-gray-100 to-gray-200 border-gray-400'
                            : 'from-orange-100 to-orange-200 border-orange-400'
                        } rounded-xl p-6 shadow-lg border-2 hover:scale-105 transition-transform`}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          {getRankBadge(team.rank)}
                        </div>
                        <div className="text-center mt-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{team.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{team.school}</p>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-3xl font-bold text-gray-900">
                              {team.points.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600">pts</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-gray-600">Missions</p>
                              <p className="font-bold text-gray-900">{team.missionsCompleted}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-gray-600">Membres</p>
                              <p className="font-bold text-gray-900">{team.members}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* All Teams Table */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Classement Complet</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rang</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Équipe</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">École</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Points</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Missions</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Membres</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Évolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {teamRankings.map((team) => (
                          <motion.tr
                            key={team.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {team.rank <= 3 ? (
                                  <div className="w-8 h-8">{getRankBadge(team.rank)}</div>
                                ) : (
                                  <span className="text-lg font-bold text-gray-700">#{team.rank}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{team.name}</span>
                                {team.badge === 'champion' && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600">{team.school}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-gray-900">{team.points.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-700">{team.missionsCompleted}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-700">{team.members}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                {getRankChangeIndicator(team.rankChange)}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="students"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top 3 Students - Podium */}
                <motion.div variants={itemVariants} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Top 3 Étudiants
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {studentRankings.slice(0, 3).map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative bg-gradient-to-br ${
                          student.rank === 1
                            ? 'from-yellow-100 to-yellow-200 border-yellow-400'
                            : student.rank === 2
                            ? 'from-gray-100 to-gray-200 border-gray-400'
                            : 'from-orange-100 to-orange-200 border-orange-400'
                        } rounded-xl p-6 shadow-lg border-2 hover:scale-105 transition-transform`}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          {getRankBadge(student.rank)}
                        </div>
                        <div className="text-center mt-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                            {student.avatar}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{student.school}</p>
                          <p className="text-xs text-gray-500 mb-4">Équipe: {student.team}</p>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-3xl font-bold text-gray-900">
                              {student.points.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600">pts</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-gray-600">Missions</p>
                              <p className="font-bold text-gray-900">{student.missionsCompleted}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-gray-600">Niveau</p>
                              <p className="font-bold text-gray-900">{student.level}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* All Students Table */}
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Classement Complet</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rang</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Étudiant</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">École</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Équipe</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Points</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Missions</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Niveau</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Évolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {studentRankings.map((student) => (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {student.rank <= 3 ? (
                                  <div className="w-8 h-8">{getRankBadge(student.rank)}</div>
                                ) : (
                                  <span className="text-lg font-bold text-gray-700">#{student.rank}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {student.avatar}
                                </div>
                                <span className="font-semibold text-gray-900">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600">{student.school}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600">{student.team}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-gray-900">{student.points.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-700">{student.missionsCompleted}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                                Niv. {student.level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                {getRankChangeIndicator(student.rankChange)}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
