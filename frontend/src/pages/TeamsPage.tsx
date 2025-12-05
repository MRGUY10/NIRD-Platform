import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Award,
  Target,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { teamService } from '../services/teamService';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

export default function TeamsPage() {
  const { user } = useAuthStore();
  const isStudent = user?.role === UserRole.STUDENT;

  const { data: myTeam, isLoading: myTeamLoading } = useQuery({
    queryKey: ['my-team'],
    queryFn: () => teamService.getMyTeam(),
    retry: false,
  });

  const { data: allTeams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeams(),
    enabled: !myTeam, // Only fetch all teams if user doesn't have a team
  });

  const isLoading = myTeamLoading || teamsLoading;

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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mon Équipe</h1>
            <p className="text-blue-100">
              {myTeam ? `Vous faites partie de ${myTeam.name}` : 'Rejoignez ou créez une équipe'}
            </p>
          </div>
          {!myTeam && user?.role === UserRole.TEACHER && (
            <Link to="/teams/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Créer une équipe
              </motion.button>
            </Link>
          )}
        </div>
      </div>

      {/* My Team Details */}
      {myTeam ? (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{myTeam.name}</h2>
              {myTeam.description && (
                <p className="text-gray-600">{myTeam.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Code d'équipe</div>
              <div className="text-2xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                {myTeam.team_code}
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{myTeam.member_count || 0}</div>
              <div className="text-sm text-gray-600">Membres</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <Target className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{myTeam.total_points || 0}</div>
              <div className="text-sm text-gray-600">Points totaux</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Badges</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">#-</div>
              <div className="text-sm text-gray-600">Rang</div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Membres de l'équipe</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeam.members && myTeam.members.length > 0 ? (
                myTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.student?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {member.student?.full_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.student?.points || 0} points
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Aucun membre pour le moment
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Available Teams */
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isStudent ? 'Équipes Disponibles' : 'Toutes les Équipes'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTeams.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune équipe disponible</p>
              </div>
            ) : (
              allTeams.map((team) => (
                <motion.div
                  key={team.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                  {team.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {team.member_count || 0} / {team.max_members} membres
                    </span>
                    <span className="font-bold text-blue-600">
                      {team.total_points || 0} pts
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
