import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Medal,
  Crown,
  Loader2
} from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardService.getLeaderboard({ period: 'all-time', page_size: 50 }),
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-100 to-amber-100 border-yellow-300';
    if (rank === 2) return 'from-gray-100 to-slate-100 border-gray-300';
    if (rank === 3) return 'from-orange-100 to-red-100 border-orange-300';
    return 'from-white to-gray-50 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold">Classement</h1>
            <p className="text-purple-100">Compétition entre équipes</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Total d'équipes</p>
            <p className="text-3xl font-bold">{leaderboard?.total_teams || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Votre rang</p>
            <p className="text-3xl font-bold">
              #{leaderboard?.current_user_team?.rank || '-'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Vos points</p>
            <p className="text-3xl font-bold">
              {leaderboard?.current_user_team?.total_points || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Classement Général
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {!leaderboard?.entries || leaderboard.entries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune équipe dans le classement</p>
            </div>
          ) : (
            leaderboard.entries.map((entry) => (
              <motion.div
                key={entry.team_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: entry.rank * 0.02 }}
                className={`p-6 bg-gradient-to-r ${getRankColor(entry.rank)} border-l-4 hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg">
                    {getRankIcon(entry.rank) || (
                      <span className="text-2xl font-bold text-gray-700">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {entry.team_name}
                    </h3>
                    {entry.school_name && (
                      <p className="text-sm text-gray-600">{entry.school_name}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {entry.member_count} membres
                      </span>
                      <span>
                        {entry.completed_missions} missions complétées
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">
                      {entry.total_points.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                    {entry.average_score > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Moy: {entry.average_score.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
