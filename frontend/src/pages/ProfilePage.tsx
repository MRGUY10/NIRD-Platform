import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Award, Settings, Camera, Save, X, Check, Edit2, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { badgeService } from '../services/badgeService';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    avatar_url: currentUser?.avatar_url || '',
  });

  const { data: userBadges } = useQuery({
    queryKey: ['myBadges'],
    queryFn: () => badgeService.getMyBadges(),
  });

  const handleSave = () => {
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <Check className="w-6 h-6" />
              <span className="font-bold">Profil mis à jour avec succès!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          {/* Animated Background */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10 flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold border-4 border-white/50 shadow-2xl cursor-pointer"
              >
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{currentUser?.full_name?.charAt(0) || 'U'}</span>
                )}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-white text-green-600 p-3 rounded-full shadow-lg"
              >
                <Camera className="w-5 h-5" />
              </motion.button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold mb-2">{currentUser?.full_name}</h1>
              <p className="text-green-100 text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {currentUser?.email}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                  {currentUser?.role === 'student' ? '🎓 Étudiant' : '👨‍🏫 Enseignant'}
                </span>
                <span className="bg-yellow-400/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {userBadges?.length || 0} Badges
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              {isEditing ? 'Annuler' : 'Modifier'}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-green-600" />
              Informations Personnelles
            </h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isEditing ? 'border-green-300 bg-white' : 'border-gray-200 bg-gray-50'
                  } focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isEditing ? 'border-green-300 bg-white' : 'border-gray-200 bg-gray-50'
                  } focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all`}
                />
              </div>

              {/* Username (readonly) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={currentUser?.username}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50"
                />
              </div>

              {/* Save Button */}
              <AnimatePresence>
                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Sauvegarder les modifications
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Activity Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <StatItem label="Badges Gagnés" value={userBadges?.length || 0} icon="🏆" />
                <StatItem label="Missions Complétées" value="12" icon="✅" />
                <StatItem label="Points Totaux" value="480" icon="⭐" />
                <StatItem label="Rang" value="#23" icon="🎯" />
              </div>
            </div>

            {/* Security */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Sécurité
              </h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                Changer le mot de passe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
    >
      <span className="text-gray-600 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {label}
      </span>
      <span className="font-bold text-green-600 text-lg">{value}</span>
    </motion.div>
  );
}
