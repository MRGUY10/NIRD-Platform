import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Filter, 
  Search, 
  Trophy, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { missionService } from '../services/missionService';
import { MissionDifficulty } from '../types';

export default function MissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missions', difficultyFilter],
    queryFn: () => missionService.getMissions({ 
      difficulty: difficultyFilter || undefined,
      limit: 50 
    }),
  });

  const { data: mySubmissions = [] } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => missionService.getMySubmissions(),
  });

  const submittedMissionIds = new Set(mySubmissions.map(s => s.mission_id));

  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Missions Disponibles</h1>
        <p className="text-green-100">Choisissez une mission et commencez à gagner des points!</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="">Toutes les difficultés</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune mission trouvée</p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isSubmitted = submittedMissionIds.has(mission.id);
            const submission = mySubmissions.find(s => s.mission_id === mission.id);

            return (
              <motion.div
                key={mission.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-green-500 transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {mission.title}
                    </h3>
                    {isSubmitted && (
                      <div className="ml-2">
                        {submission?.status === 'approved' && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                        {submission?.status === 'pending' && (
                          <Clock className="w-6 h-6 text-yellow-500" />
                        )}
                        {submission?.status === 'rejected' && (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {mission.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-bold">
                      <Trophy className="w-4 h-4" />
                      {mission.points} pts
                    </span>
                  </div>

                  {/* Deadline */}
                  {mission.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Deadline: {new Date(mission.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link to={`/missions/${mission.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        isSubmitted
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {isSubmitted ? 'Voir la soumission' : 'Commencer'}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
