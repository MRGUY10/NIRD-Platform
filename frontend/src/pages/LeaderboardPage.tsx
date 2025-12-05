import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Medal,
  Crown,
  Loader2,
  Star,
  Target
} from 'lucide-react';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';

export default function LeaderboardPage() {
  const { user: currentUser } = useAuthStore();
  
  const { data: rankings, isLoading } = useQuery({
    queryKey: ['userRankings'],
    queryFn: () => userService.getRankings({ limit: 50 }),
  });

  const { data: myStats } = useQuery({
    queryKey: ['myStats'],
    queryFn: () => userService.getMyStats(),
    enabled: !!currentUser,
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
            <h1 className="text-4xl font-bold">Classement des Utilisateurs</h1>
            <p className="text-purple-100">Compétition individuelle basée sur les points</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Total d'utilisateurs</p>
            <p className="text-3xl font-bold">{rankings?.length || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Votre rang</p>
            <p className="text-3xl font-bold">
              #{myStats?.global_rank || '-'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Vos points</p>
            <p className="text-3xl font-bold">
              {myStats?.total_points || 0}
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
          {!rankings || rankings.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun utilisateur dans le classement</p>
            </div>
          ) : (
            rankings.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: user.global_rank * 0.02 }}
                className={`p-6 bg-gradient-to-r ${getRankColor(user.global_rank)} border-l-4 hover:shadow-md transition-all ${
                  currentUser?.id === user.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg">
                    {getRankIcon(user.global_rank) || (
                      <span className="text-2xl font-bold text-gray-700">
                        {user.global_rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {user.full_name || user.username}
                      </h3>
                      {currentUser?.id === user.id && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                          Vous
                        </span>
                      )}
                    </div>
                    
                    {/* Level Badge */}
                    {user.level && (
                      <div className="flex items-center gap-3 mb-2">
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-bold"
                          style={{ 
                            backgroundColor: `${user.level.level_color}20`, 
                            color: user.level.level_color 
                          }}
                        >
                          {user.level.level_name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {user.missions_completed} missions
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {user.badges_earned} badges
                      </span>
                      {user.team && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {user.team.team_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <div className="text-3xl font-bold text-purple-600">
                        {user.total_points.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                    {user.level && user.level.progress_percentage > 0 && (
                      <div className="mt-2 w-24">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${user.level.progress_percentage}%`,
                              backgroundColor: user.level.level_color
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {user.level.progress_percentage.toFixed(0)}% au prochain niveau
                        </div>
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

