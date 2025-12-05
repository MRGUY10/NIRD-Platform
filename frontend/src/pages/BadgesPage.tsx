import { motion } from 'framer-motion';
import { Award, Trophy, Star, Lock, Target, Zap, Crown, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { badgeService } from '../services/badgeService';

export default function BadgesPage() {
  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['myBadges'],
    queryFn: () => badgeService.getMyBadges(),
  });

  const { data: allBadges } = useQuery({
    queryKey: ['allBadges'],
    queryFn: () => badgeService.getAllBadges(),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge.id) || []);
  const progress = allBadges ? (userBadges?.length || 0) / allBadges.length * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3"
          >
            <Trophy className="w-10 h-10 text-yellow-500" />
            Mes Badges
          </motion.h1>
          <p className="text-gray-600 mt-2">Débloquez des badges en complétant des missions et en participant activement!</p>
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Progression Totale</h3>
              <p className="text-gray-600">{userBadges?.length || 0} sur {allBadges?.length || 0} badges débloqués</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Crown className="w-16 h-16 text-yellow-500" />
            </motion.div>
          </div>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
              {progress.toFixed(0)}%
            </div>
          </div>
        </motion.div>

        {/* Earned Badges */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Badges Débloqués
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : userBadges && userBadges.length > 0 ? (
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBadges.map((userBadge) => (
                <motion.div
                  key={userBadge.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-green-200 relative overflow-hidden"
                >
                  {/* Shine Effect */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl shadow-lg"
                      >
                        <Award className="w-8 h-8 text-white" />
                      </motion.div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        Débloqué
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{userBadge.badge.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{userBadge.badge.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {new Date(userBadge.earned_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-green-600 font-bold">+{userBadge.badge.points_value} pts</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucun badge débloqué pour le moment. Complétez des missions pour en gagner!</p>
            </div>
          )}
        </motion.div>

        {/* Locked Badges */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-gray-400" />
            Badges à Débloquer
          </h2>
          {allBadges && (
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allBadges
                .filter(badge => !earnedBadgeIds.has(badge.id))
                .map((badge) => (
                  <motion.div
                    key={badge.id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-5 border-2 border-gray-200 relative overflow-hidden opacity-75 hover:opacity-100"
                  >
                    <div className="absolute top-2 right-2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="bg-gray-200 p-3 rounded-xl mb-3 inline-block">
                      <Shield className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">{badge.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{badge.description}</p>
                    <div className="text-sm text-gray-400">
                      <Target className="w-4 h-4 inline mr-1" />
                      {badge.points_value} points
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
