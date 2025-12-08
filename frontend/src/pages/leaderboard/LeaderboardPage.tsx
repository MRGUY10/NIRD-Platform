import { useState, useEffect } from 'react';
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
  Loader,
  AlertCircle,
} from 'lucide-react';
import { leaderboardService, type LeaderboardEntry } from '../../services/leaderboardService';
import { getErrorMessage } from '../../lib/api-client';

type TimeFilter = 'all' | 'month' | 'week';

const LeaderboardPage = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: any = { limit: 50 };
        
        // Apply time filter
        if (timeFilter === 'week') {
          params.days = 7;
        } else if (timeFilter === 'month') {
          params.days = 30;
        }

        const response = await leaderboardService.getLeaderboard(params);
        setRankings(response.entries);
        setLastUpdated(new Date(response.last_updated));
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter]);

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
          {!loading && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Équipes Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{rankings.length}</p>
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
                      {rankings.reduce((sum, r) => sum + r.total_points, 0).toLocaleString()}
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
                    <p className="text-2xl font-bold text-gray-900">
                      {rankings.reduce((sum, r) => sum + r.missions_completed, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dernière MàJ</p>
                    <p className="text-sm font-bold text-gray-900">
                      {lastUpdated ? lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement du classement...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-red-900 mb-2">Erreur de chargement</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Filters */}
          {!loading && !error && (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-wrap gap-4">
                {/* Time Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeFilter('all')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
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
            </div>
          </motion.div>
          )}

          {/* Leaderboard Content */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
                {/* Top 3 Teams - Podium */}
                <motion.div variants={itemVariants} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Top 3 Équipes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rankings.slice(0, 3).map((team, index) => (
                      <motion.div
                        key={team.team_id}
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
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{team.team_name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{team.school_name || 'Sans école'}</p>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-3xl font-bold text-gray-900">
                              {team.total_points.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600">pts</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-gray-600">Missions</p>
                              <p className="font-bold text-gray-900">{team.missions_completed}</p>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2">
                              <p className="text-gray-600">Moyenne</p>
                              <p className="font-bold text-gray-900">{team.average_score?.toFixed(1) || '0'}</p>
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
                        {rankings.map((team) => (
                          <motion.tr
                            key={team.team_id}
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
                                <span className="font-semibold text-gray-900">{team.team_name}</span>
                                {team.rank === 1 && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-600">{team.school_name || 'Sans école'}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-gray-900">{team.total_points.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-700">{team.missions_completed}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-700">-</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                {getRankChangeIndicator(team.rank_change || 0)}
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
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
 
