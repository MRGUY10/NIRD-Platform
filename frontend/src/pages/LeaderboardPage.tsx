import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Medal,
  Crown,
  Loader2,
  Award,
  Star
} from 'lucide-react';
import { leaderboardService } from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';

export default function LeaderboardPage() {
  const { user: currentUser } = useAuthStore();
  
  const { data: userLeaderboard, isLoading } = useQuery({
    queryKey: ['userLeaderboard'],
    queryFn: () => leaderboardService.getUserLeaderboard({ limit: 100 }),
  });

  // Find current user's entry
  const currentUserEntry = userLeaderboard?.entries.find(
    entry => entry.user_id === currentUser?.id
  );

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

  const getRoleBadge = (role: string) => {
    if (role === 'student') return { label: '🎓 Étudiant', color: 'bg-blue-100 text-blue-700' };
    if (role === 'teacher') return { label: '👨‍🏫 Enseignant', color: 'bg-purple-100 text-purple-700' };
    if (role === 'admin') return { label: '⚡ Admin', color: 'bg-red-100 text-red-700' };
    return { label: role, color: 'bg-gray-100 text-gray-700' };
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
            <p className="text-purple-100">Compétition individuelle</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Total d'utilisateurs</p>
            <p className="text-3xl font-bold">{userLeaderboard?.total_users || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Votre rang</p>
            <p className="text-3xl font-bold">
              #{currentUserEntry?.rank || '-'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="text-purple-100 text-sm">Vos points</p>
            <p className="text-3xl font-bold">
              {currentUserEntry?.total_points || 0}
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
          {!userLeaderboard?.entries || userLeaderboard.entries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun utilisateur dans le classement</p>
            </div>
          ) : (
            userLeaderboard.entries.map((entry) => {
              const roleBadge = getRoleBadge(entry.role);
              const isCurrentUser = entry.user_id === currentUser?.id;
              
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: entry.rank * 0.01 }}
                  className={`p-6 bg-gradient-to-r ${getRankColor(entry.rank)} border-l-4 hover:shadow-md transition-all ${
                    isCurrentUser ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                  }`}
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

                    {/* Avatar */}
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl font-bold shadow-md">
                      {entry.avatar_url ? (
                        <img 
                          src={entry.avatar_url} 
                          alt={entry.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{entry.full_name?.charAt(0) || entry.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {entry.full_name || entry.username}
                        </h3>
                        {isCurrentUser && (
                          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                            VOUS
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">@{entry.username}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 ${roleBadge.color} text-xs font-bold rounded-full`}>
                          {roleBadge.label}
                        </span>
                        {entry.team_name && (
                          <span className="text-sm text-gray-600">
                            🏆 {entry.team_name}
                          </span>
                        )}
                        {entry.school_name && (
                          <span className="text-sm text-gray-600">
                            🏫 {entry.school_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {entry.missions_completed} missions
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-purple-500" />
                          {entry.badges_earned} badges
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">
                        {entry.total_points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">points</div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
