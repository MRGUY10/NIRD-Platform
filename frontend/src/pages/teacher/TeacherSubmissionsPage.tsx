import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  Search,
  X,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  Target,
  Award,
  MessageSquare,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { MissionDifficulty } from '../../types';
import { submissionService } from '../../services/missionService';
import { getErrorMessage } from '../../lib/api-client';

// Types
interface Submission {
  id: number;
  studentName: string;
  studentAvatar: string;
  missionTitle: string;
  missionId: number;
  difficulty: MissionDifficulty;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  attachments: string[];
  feedback?: string;
  reviewedDate?: string;
}

const TeacherSubmissionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load submissions from backend
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await submissionService.listSubmissions({});
        setSubmissions(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadSubmissions();
  }, []);

  // Mock data kept for fallback - Submissions
  const mockSubmissions: Submission[] = [
    {
      id: 1,
      studentName: 'Marie Dubois',
      studentAvatar: 'MD',
      missionTitle: 'Recycler 5 Téléphones Portables',
      missionId: 1,
      difficulty: MissionDifficulty.EASY,
      submittedDate: '2025-12-04T14:30:00Z',
      status: 'pending',
      content: 'J\'ai collecté 5 téléphones portables de ma famille et les ai apportés au centre de recyclage local. Voici les photos comme preuve.',
      attachments: ['photo1.jpg', 'photo2.jpg', 'receipt.pdf'],
    },
    {
      id: 2,
      studentName: 'Lucas Martin',
      studentAvatar: 'LM',
      missionTitle: 'Créer une Affiche de Sensibilisation',
      missionId: 2,
      difficulty: MissionDifficulty.MEDIUM,
      submittedDate: '2025-12-03T10:15:00Z',
      status: 'pending',
      content: 'Voici mon affiche créative sur les dangers des e-déchets. J\'ai utilisé Canva et imprimé 20 copies pour l\'école.',
      attachments: ['poster.pdf', 'poster_preview.jpg'],
    },
    {
      id: 3,
      studentName: 'Sophie Bernard',
      studentAvatar: 'SB',
      missionTitle: 'Enquête sur les E-Déchets dans Votre Quartier',
      missionId: 4,
      difficulty: MissionDifficulty.MEDIUM,
      submittedDate: '2025-12-02T16:45:00Z',
      status: 'approved',
      content: 'J\'ai mené une enquête auprès de 25 personnes dans mon quartier. Voici les résultats compilés avec des graphiques.',
      attachments: ['survey_results.xlsx', 'analysis.pdf'],
      feedback: 'Excellent travail! Vos données sont bien présentées et analysées. Continue comme ça!',
      reviewedDate: '2025-12-03T09:00:00Z',
    },
    {
      id: 4,
      studentName: 'Thomas Petit',
      studentAvatar: 'TP',
      missionTitle: 'Recycler 5 Téléphones Portables',
      missionId: 1,
      difficulty: MissionDifficulty.EASY,
      submittedDate: '2025-12-01T11:20:00Z',
      status: 'approved',
      content: 'Mission accomplie! J\'ai recyclé 5 vieux téléphones au centre de recyclage municipal.',
      attachments: ['proof.jpg', 'receipt.pdf'],
      feedback: 'Très bien! Merci d\'avoir participé activement au recyclage.',
      reviewedDate: '2025-12-02T08:30:00Z',
    },
    {
      id: 5,
      studentName: 'Emma Rousseau',
      studentAvatar: 'ER',
      missionTitle: 'Créer une Affiche de Sensibilisation',
      missionId: 2,
      difficulty: MissionDifficulty.MEDIUM,
      submittedDate: '2025-11-30T14:00:00Z',
      status: 'rejected',
      content: 'Voici mon affiche. Je l\'ai faite rapidement.',
      attachments: ['poster.jpg'],
      feedback: 'L\'affiche manque de détails et d\'informations. Merci de retravailler le contenu avec plus de recherches sur les e-déchets.',
      reviewedDate: '2025-12-01T10:00:00Z',
    },
    {
      id: 6,
      studentName: 'Hugo Leroy',
      studentAvatar: 'HL',
      missionTitle: 'Recycler 5 Téléphones Portables',
      missionId: 1,
      difficulty: MissionDifficulty.EASY,
      submittedDate: '2025-12-04T09:30:00Z',
      status: 'pending',
      content: 'J\'ai collecté 6 téléphones (un bonus!) et les ai tous recyclés correctement.',
      attachments: ['collection.jpg', 'receipt.pdf'],
    },
    {
      id: 7,
      studentName: 'Chloé Moreau',
      studentAvatar: 'CM',
      missionTitle: 'Organiser un Atelier de Réparation',
      missionId: 3,
      difficulty: MissionDifficulty.HARD,
      submittedDate: '2025-12-03T15:20:00Z',
      status: 'pending',
      content: 'J\'ai organisé un atelier de réparation avec 15 participants. Nous avons réparé 8 appareils. Voir le rapport complet et les photos.',
      attachments: ['workshop_report.pdf', 'photos.zip', 'attendance.xlsx'],
    },
    {
      id: 8,
      studentName: 'Alexandre Simon',
      studentAvatar: 'AS',
      missionTitle: 'Enquête sur les E-Déchets dans Votre Quartier',
      missionId: 4,
      difficulty: MissionDifficulty.MEDIUM,
      submittedDate: '2025-12-04T11:00:00Z',
      status: 'pending',
      content: 'Enquête complétée auprès de 22 personnes. Les résultats montrent un manque de sensibilisation significatif.',
      attachments: ['survey.pdf', 'data.xlsx'],
    },
  ];

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.missionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus;
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
      case 'pending':
        return 'En Attente';
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      default:
        return status;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle approve submission
  const handleApprove = async () => {
    if (!selectedSubmission) return;
    try {
      setSubmitting(true);
      await submissionService.reviewSubmission(selectedSubmission.id, {
        status: 'approved',
        feedback: feedbackText.trim() || undefined,
      });
      setSelectedSubmission(null);
      setFeedbackText('');
      // Reload submissions
      const data = await submissionService.listSubmissions({});
      setSubmissions(data);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reject submission
  const handleReject = async () => {
    if (!selectedSubmission) return;
    if (!feedbackText.trim()) {
      alert('Veuillez fournir un commentaire pour le rejet');
      return;
    }
    try {
      setSubmitting(true);
      await submissionService.reviewSubmission(selectedSubmission.id, {
        status: 'rejected',
        feedback: feedbackText.trim(),
      });
      setSelectedSubmission(null);
      setFeedbackText('');
      // Reload submissions
      const data = await submissionService.listSubmissions({});
      setSubmissions(data);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des soumissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-xl shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Revue des Soumissions</h1>
                <p className="text-gray-600 mt-1">
                  Évaluez les soumissions de missions des étudiants
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter((s) => s.status === 'pending').length}
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
                  <p className="text-sm text-gray-600">Approuvées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter((s) => s.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejetées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter((s) => s.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
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
                  placeholder="Rechercher par étudiant ou mission..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setSelectedStatus('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'pending'
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    En Attente
                  </button>
                  <button
                    onClick={() => setSelectedStatus('approved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'approved'
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Approuvées
                  </button>
                  <button
                    onClick={() => setSelectedStatus('rejected')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'rejected'
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Rejetées
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submissions List */}
          <motion.div variants={containerVariants} className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <motion.div
                key={submission.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedSubmission(submission)}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Student Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {submission.studentAvatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{submission.missionTitle}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {submission.studentName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.submittedDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(submission.difficulty)}`}>
                          {getDifficultyLabel(submission.difficulty)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                          {getStatusLabel(submission.status)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{submission.content}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{submission.attachments.length} fichier(s)</span>
                      </div>
                      {submission.status === 'pending' && (
                        <span className="text-orange-600 font-semibold">
                          En attente de révision
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredSubmissions.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune soumission trouvée</h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSubmission(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {selectedSubmission.studentAvatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubmission.missionTitle}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{selectedSubmission.studentName}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedSubmission.submittedDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedSubmission.difficulty)}`}>
                      {getDifficultyLabel(selectedSubmission.difficulty)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedSubmission.status)}`}>
                      {getStatusLabel(selectedSubmission.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contenu de la Soumission</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedSubmission.content}</p>
                </div>
              </div>

              {/* Attachments */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Fichiers Joints</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedSubmission.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700 font-medium">{file}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Feedback (if reviewed) */}
              {selectedSubmission.feedback && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Feedback Fourni</h3>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-gray-800 leading-relaxed">{selectedSubmission.feedback}</p>
                    {selectedSubmission.reviewedDate && (
                      <p className="text-xs text-gray-600 mt-2">
                        Évalué le {new Date(selectedSubmission.reviewedDate).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback Form (for pending submissions) */}
              {selectedSubmission.status === 'pending' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Ajouter un Feedback</h3>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Écrivez votre feedback pour l'étudiant..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedSubmission.status === 'pending' ? (
                  <>
                    <button
                      onClick={handleApprove}
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Approuver
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      Rejeter
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Fermer
                  </button>
                )}
                {selectedSubmission.status === 'pending' && (
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherSubmissionsPage;
