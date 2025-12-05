import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { MissionDifficulty } from '../../types';

// Types
interface TeacherMission {
  id: number;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  points: number;
  deadline: string;
  categoryId: number;
  categoryName: string;
  status: 'draft' | 'active' | 'archived';
  totalSubmissions: number;
  pendingReviews: number;
  completedSubmissions: number;
  createdAt: string;
}

const TeacherMissionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'active' | 'archived'>('all');
  const [selectedMission, setSelectedMission] = useState<TeacherMission | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<MissionDifficulty>(MissionDifficulty.MEDIUM);
  const [formPoints, setFormPoints] = useState(100);
  const [formDeadline, setFormDeadline] = useState('');
  const [formCategory, setFormCategory] = useState(1);

  // Mock data - Teacher's Missions
  const missions: TeacherMission[] = [
    {
      id: 1,
      title: 'Recycler 5 Téléphones Portables',
      description: 'Collectez et apportez 5 téléphones portables usagés au centre de recyclage.',
      difficulty: MissionDifficulty.EASY,
      points: 100,
      deadline: '2025-12-31',
      categoryId: 1,
      categoryName: 'Collecte',
      status: 'active',
      totalSubmissions: 45,
      pendingReviews: 12,
      completedSubmissions: 28,
      createdAt: '2025-11-01',
    },
    {
      id: 2,
      title: 'Créer une Affiche de Sensibilisation',
      description: 'Créez une affiche créative pour sensibiliser aux dangers des e-déchets.',
      difficulty: MissionDifficulty.MEDIUM,
      points: 200,
      deadline: '2025-12-25',
      categoryId: 2,
      categoryName: 'Sensibilisation',
      status: 'active',
      totalSubmissions: 32,
      pendingReviews: 8,
      completedSubmissions: 20,
      createdAt: '2025-11-05',
    },
    {
      id: 3,
      title: 'Organiser un Atelier de Réparation',
      description: 'Organisez un atelier pour apprendre à réparer de vieux appareils électroniques.',
      difficulty: MissionDifficulty.HARD,
      points: 500,
      deadline: '2026-01-15',
      categoryId: 3,
      categoryName: 'Événements',
      status: 'active',
      totalSubmissions: 8,
      pendingReviews: 3,
      completedSubmissions: 4,
      createdAt: '2025-11-10',
    },
    {
      id: 4,
      title: 'Enquête sur les E-Déchets dans Votre Quartier',
      description: 'Menez une enquête auprès de 20 personnes sur leurs habitudes de recyclage.',
      difficulty: MissionDifficulty.MEDIUM,
      points: 250,
      deadline: '2025-12-20',
      categoryId: 4,
      categoryName: 'Recherche',
      status: 'active',
      totalSubmissions: 18,
      pendingReviews: 5,
      completedSubmissions: 10,
      createdAt: '2025-11-12',
    },
    {
      id: 5,
      title: 'Mission Test - Brouillon',
      description: 'Ceci est une mission en cours de création.',
      difficulty: MissionDifficulty.EASY,
      points: 50,
      deadline: '2025-12-30',
      categoryId: 1,
      categoryName: 'Collecte',
      status: 'draft',
      totalSubmissions: 0,
      pendingReviews: 0,
      completedSubmissions: 0,
      createdAt: '2025-11-28',
    },
    {
      id: 6,
      title: 'Ancienne Mission - Archivée',
      description: 'Mission terminée et archivée.',
      difficulty: MissionDifficulty.MEDIUM,
      points: 150,
      deadline: '2025-10-31',
      categoryId: 2,
      categoryName: 'Sensibilisation',
      status: 'archived',
      totalSubmissions: 52,
      pendingReviews: 0,
      completedSubmissions: 52,
      createdAt: '2025-09-01',
    },
  ];

  // Filter missions
  const filteredMissions = missions.filter((mission) => {
    const matchesSearch =
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || mission.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get difficulty label
  const getDifficultyLabel = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case MissionDifficulty.EASY:
        return 'Facile';
      case MissionDifficulty.MEDIUM:
        return 'Moyen';
      case MissionDifficulty.HARD:
        return 'Difficile';
      default:
        return 'Moyen';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case MissionDifficulty.EASY:
        return 'bg-green-100 text-green-700';
      case MissionDifficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-700';
      case MissionDifficulty.HARD:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'active':
        return 'Active';
      case 'archived':
        return 'Archivée';
      default:
        return status;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'archived':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle create mission
  const handleCreateMission = () => {
    console.log('Creating mission:', { formTitle, formDescription, formDifficulty, formPoints, formDeadline, formCategory });
    setShowCreateModal(false);
    resetForm();
  };

  // Handle edit mission
  const handleEditMission = () => {
    console.log('Editing mission:', selectedMission?.id);
    setShowEditModal(false);
    resetForm();
  };

  // Handle delete mission
  const handleDeleteMission = (missionId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mission?')) {
      console.log('Deleting mission:', missionId);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDifficulty(MissionDifficulty.MEDIUM);
    setFormPoints(100);
    setFormDeadline('');
    setFormCategory(1);
  };

  // Open edit modal
  const openEditModal = (mission: TeacherMission) => {
    setSelectedMission(mission);
    setFormTitle(mission.title);
    setFormDescription(mission.description);
    setFormDifficulty(mission.difficulty);
    setFormPoints(mission.points);
    setFormDeadline(mission.deadline);
    setFormCategory(mission.categoryId);
    setShowEditModal(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Gestion des Missions</h1>
                  <p className="text-gray-600 mt-1">
                    Créez et gérez vos missions pour les étudiants
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Nouvelle Mission
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Missions Actives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {missions.filter((m) => m.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {missions.reduce((sum, m) => sum + m.pendingReviews, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Complétées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {missions.reduce((sum, m) => sum + m.completedSubmissions, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Soumissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {missions.reduce((sum, m) => sum + m.totalSubmissions, 0)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search Bar */}
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher des missions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Statut</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setSelectedStatus('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'active'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Actives
                  </button>
                  <button
                    onClick={() => setSelectedStatus('draft')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'draft'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Brouillons
                  </button>
                  <button
                    onClick={() => setSelectedStatus('archived')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'archived'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Archivées
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Missions Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mission</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Difficulté</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Soumissions</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">En Attente</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Date Limite</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMissions.map((mission) => (
                    <motion.tr
                      key={mission.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{mission.title}</p>
                          <p className="text-sm text-gray-500">{mission.categoryName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(mission.difficulty)}`}>
                          {getDifficultyLabel(mission.difficulty)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-gray-900">{mission.points}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status)}`}>
                          {getStatusLabel(mission.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">{mission.totalSubmissions}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {mission.pendingReviews > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                            {mission.pendingReviews}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(mission.deadline).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedMission(mission)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(mission)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMission(mission.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* No Results */}
          {filteredMissions.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune mission trouvée</h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou créez une nouvelle mission
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && !showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMission(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedMission.title}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Catégorie</span>
                  <span className="font-semibold text-gray-900">{selectedMission.categoryName}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Difficulté</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedMission.difficulty)}`}>
                    {getDifficultyLabel(selectedMission.difficulty)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Points</span>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{selectedMission.points} pts</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMission.status)}`}>
                    {getStatusLabel(selectedMission.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Date Limite</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedMission.deadline).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMission.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedMission.totalSubmissions}</p>
                  <p className="text-sm text-gray-600">Soumissions</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedMission.pendingReviews}</p>
                  <p className="text-sm text-gray-600">En Attente</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedMission.completedSubmissions}</p>
                  <p className="text-sm text-gray-600">Validées</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(selectedMission)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Modifier
                </button>
                <button
                  onClick={() => setSelectedMission(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Mission Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {showCreateModal ? 'Créer une Nouvelle Mission' : 'Modifier la Mission'}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Titre de la mission..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Description détaillée..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Difficulté
                    </label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value as MissionDifficulty)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={MissionDifficulty.EASY}>Facile</option>
                      <option value={MissionDifficulty.MEDIUM}>Moyen</option>
                      <option value={MissionDifficulty.HARD}>Difficile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      value={formPoints}
                      onChange={(e) => setFormPoints(Number(e.target.value))}
                      min="10"
                      step="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Collecte</option>
                      <option value={2}>Sensibilisation</option>
                      <option value={3}>Événements</option>
                      <option value={4}>Recherche</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Limite
                    </label>
                    <input
                      type="date"
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={showCreateModal ? handleCreateMission : handleEditMission}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  {showCreateModal ? 'Créer' : 'Enregistrer'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherMissionsPage;
