import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Trophy,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Zap,
  Star,
  Image as ImageIcon,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { Mission } from '../../types';
import { MissionDifficulty } from '../../types';

export const MissionsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | MissionDifficulty>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Mock missions data - will be replaced with API call
  const missions: Mission[] = [
    {
      id: 1,
      title: 'Recycler un Vieux Téléphone',
      description: 'Trouvez un centre de recyclage local et disposez correctement d\'un ancien téléphone. Prenez une photo du processus.',
      category_id: 1,
      difficulty: MissionDifficulty.EASY,
      points: 100,
      is_active: true,
      created_by: 2,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      submission_count: 12,
      category: { id: 1, name: 'Recyclage E-déchets', description: '', icon: '', created_at: '2025-01-01' }
    },
    {
      id: 2,
      title: 'Guide de Tri des Batteries',
      description: 'Recherchez et créez un guide sur comment trier correctement les batteries dans votre région. Partagez-le avec votre communauté.',
      category_id: 1,
      difficulty: MissionDifficulty.MEDIUM,
      points: 200,
      is_active: true,
      created_by: 2,
      created_at: '2025-01-02',
      updated_at: '2025-01-02',
      submission_count: 8,
      category: { id: 1, name: 'Recyclage E-déchets', description: '', icon: '', created_at: '2025-01-01' }
    },
    {
      id: 3,
      title: 'Réparer un Appareil Cassé',
      description: 'Tentez de réparer un appareil électronique cassé. Documentez le processus de réparation avec des photos.',
      category_id: 2,
      difficulty: MissionDifficulty.HARD,
      points: 300,
      is_active: true,
      created_by: 2,
      created_at: '2025-01-03',
      updated_at: '2025-01-03',
      submission_count: 5,
      category: { id: 2, name: 'Réparation d\'Appareils', description: '', icon: '', created_at: '2025-01-01' }
    },
    {
      id: 4,
      title: 'Audit Énergétique Maison',
      description: 'Effectuez un audit énergétique de votre maison et identifiez les appareils énergivores.',
      category_id: 3,
      difficulty: MissionDifficulty.MEDIUM,
      points: 200,
      is_active: true,
      created_by: 2,
      created_at: '2025-01-04',
      updated_at: '2025-01-04',
      submission_count: 15,
      category: { id: 3, name: 'Efficacité Énergétique', description: '', icon: '', created_at: '2025-01-01' }
    },
    {
      id: 5,
      title: 'Campagne de Sensibilisation École',
      description: 'Organisez une campagne de sensibilisation sur les e-déchets dans votre école.',
      category_id: 4,
      difficulty: MissionDifficulty.HARD,
      points: 400,
      is_active: true,
      created_by: 2,
      created_at: '2025-01-05',
      updated_at: '2025-01-05',
      submission_count: 3,
      category: { id: 4, name: 'Sensibilisation', description: '', icon: '', created_at: '2025-01-01' }
    },
    {
      id: 6,
      title: 'Donner des Électroniques Fonctionnels',
      description: 'Donnez des appareils fonctionnels mais inutilisés à une association ou école.',
      category_id: 1,
      difficulty: MissionDifficulty.EASY,
      points: 150,
      is_active: true,
      created_by: 2,
      created_at: '2025-01-06',
      updated_at: '2025-01-06',
      submission_count: 20,
      category: { id: 1, name: 'Recyclage E-déchets', description: '', icon: '', created_at: '2025-01-01' }
    }
  ];

  const difficultyColors = {
    easy: { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', badge: 'bg-green-100' },
    medium: { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-700', badge: 'bg-yellow-100' },
    hard: { bg: 'from-red-500 to-pink-500', text: 'text-red-700', badge: 'bg-red-100' },
    expert: { bg: 'from-purple-500 to-indigo-500', text: 'text-purple-700', badge: 'bg-purple-100' }
  };

  const difficultyLabels = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    expert: 'Expert'
  };

  const filteredMissions = missions.filter(mission => {
    const matchesFilter = selectedFilter === 'all' || mission.difficulty === selectedFilter;
    const matchesSearch = mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Target className="w-10 h-10 text-green-600" />
            Missions Disponibles
          </h1>
          <p className="text-gray-600 mt-2">Complétez des missions pour gagner des points et badges</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <p className="text-sm font-semibold text-green-700">
              {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} disponible{filteredMissions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tout
            </motion.button>
            {[MissionDifficulty.EASY, MissionDifficulty.MEDIUM, MissionDifficulty.HARD].map((difficulty) => (
              <motion.button
                key={difficulty}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(difficulty)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  selectedFilter === difficulty
                    ? `bg-gradient-to-r ${difficultyColors[difficulty].bg} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {difficultyLabels[difficulty]}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Missions Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredMissions.map((mission) => {
          const colors = difficultyColors[mission.difficulty];
          return (
            <motion.div
              key={mission.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedMission(mission)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-br ${colors.bg} p-6 relative overflow-hidden`}>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 ${colors.badge} ${colors.text} rounded-full text-xs font-bold`}>
                      {difficultyLabels[mission.difficulty]}
                    </span>
                    <div className="flex items-center gap-1 text-white font-bold">
                      <Trophy className="w-5 h-5" />
                      {mission.points} pts
                    </div>
                  </div>
                  {mission.category && (
                    <span className="text-sm text-white/90 font-semibold">
                      {mission.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{mission.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mission.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    {mission.submission_count || 0} soumissions
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-green-600 font-bold hover:text-green-700"
                  >
                    Commencer →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredMissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune mission trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
        </motion.div>
      )}

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && (
          <MissionDetailModal
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Mission Detail Modal Component
interface MissionDetailModalProps {
  mission: Mission;
  onClose: () => void;
}

const MissionDetailModal = ({ mission, onClose }: MissionDetailModalProps) => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const difficultyColors: Record<MissionDifficulty, { bg: string; text: string; badge: string }> = {
    [MissionDifficulty.EASY]: { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', badge: 'bg-green-100' },
    [MissionDifficulty.MEDIUM]: { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-700', badge: 'bg-yellow-100' },
    [MissionDifficulty.HARD]: { bg: 'from-red-500 to-pink-500', text: 'text-red-700', badge: 'bg-red-100' }
  };

  const difficultyLabels: Record<MissionDifficulty, string> = {
    [MissionDifficulty.EASY]: 'Facile',
    [MissionDifficulty.MEDIUM]: 'Moyen',
    [MissionDifficulty.HARD]: 'Difficile'
  };

  const colors = difficultyColors[mission.difficulty];

  const handleSubmit = () => {
    console.log('Submitting mission:', { description, photoUrl, fileUrl });
    // API call will go here
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${colors.bg} p-8 relative overflow-hidden`}>
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/20 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/20 rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-4 py-2 ${colors.badge} ${colors.text} rounded-full text-sm font-bold`}>
                {difficultyLabels[mission.difficulty]}
              </span>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{mission.title}</h2>
            {mission.category && (
              <span className="text-white/90 font-semibold">{mission.category.name}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Points and Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{mission.points}</p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{mission.submission_count || 0}</p>
              <p className="text-sm text-gray-600">Soumissions</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">Active</p>
              <p className="text-sm text-gray-600">Statut</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{mission.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Exigences</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700">Description détaillée requise</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Photo recommandée</span>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          {showSubmitForm ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Soumettre Votre Mission</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description de votre soumission *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Décrivez comment vous avez complété la mission..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  URL de la photo (optionnel)
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  URL du fichier (optionnel)
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Soumettre la Mission
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSubmitForm(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Annuler
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSubmitForm(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Commencer Cette Mission
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
