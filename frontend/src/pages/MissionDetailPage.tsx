import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  Users, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Target,
  Send
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { missionService } from '../services/missionService';

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: mission, isLoading } = useQuery({
    queryKey: ['mission', id],
    queryFn: () => missionService.getMissionById(Number(id)),
    enabled: !!id,
  });

  const submitMissionMutation = useMutation({
    mutationFn: (data: { content: string; attachment_url?: string }) => 
      missionService.submitMission(Number(id), data),
    onSuccess: () => {
      setShowSuccess(true);
      setShowSubmitModal(false);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/missions');
      }, 2000);
    },
  });

  const handleSubmit = () => {
    if (!submissionText.trim()) return;
    submitMissionMutation.mutate({ content: submissionText });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'facile': return 'bg-green-100 text-green-700 border-green-300';
      case 'moyen': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'difficile': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Mission introuvable</h2>
          <button
            onClick={() => navigate('/missions')}
            className="mt-4 text-green-600 hover:underline"
          >
            Retour aux missions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold">Mission soumise avec succès!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/missions')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux missions
        </motion.button>

        {/* Mission Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold mb-3">{mission.title}</h1>
                <p className="text-green-100 text-lg">{mission.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getDifficultyColor(mission.difficulty)}`}>
                {mission.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Award className="w-6 h-6 mb-2" />
                <p className="text-sm text-green-100">Points</p>
                <p className="text-2xl font-bold">{mission.points}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Clock className="w-6 h-6 mb-2" />
                <p className="text-sm text-green-100">Durée estimée</p>
                <p className="text-2xl font-bold">2-3h</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Users className="w-6 h-6 mb-2" />
                <p className="text-sm text-green-100">Participants</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                Instructions
              </h2>
              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Cette mission vous permettra de développer vos compétences en travail d'équipe 
                  et en résolution de problèmes. Suivez attentivement les étapes ci-dessous :
                </p>
                <ol className="space-y-3 mt-4">
                  <li className="text-gray-700">Formez une équipe de 3-4 personnes</li>
                  <li className="text-gray-700">Analysez le problème présenté dans les ressources</li>
                  <li className="text-gray-700">Développez une solution collaborative</li>
                  <li className="text-gray-700">Documentez votre processus de réflexion</li>
                  <li className="text-gray-700">Soumettez votre travail avant la date limite</li>
                </ol>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Ressources
              </h2>
              <div className="space-y-3">
                {['Guide de démarrage.pdf', 'Exemple de solution.docx', 'Vidéo tutoriel'].map((resource, index) => (
                  <motion.div
                    key={resource}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">{resource}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Deadline */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Date Limite
              </h3>
              <p className="text-2xl font-bold text-gray-900">15 Mai 2024</p>
              <p className="text-sm text-gray-600 mt-2">Dans 5 jours</p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Soumettre ma mission
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Soumettre votre travail</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description de votre solution
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all"
                    placeholder="Décrivez votre solution et votre processus..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Fichier joint (optionnel)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Cliquez pour uploader un fichier</p>
                    <p className="text-sm text-gray-400 mt-1">PDF, DOC, ZIP (max 10MB)</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!submissionText.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Soumettre
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
