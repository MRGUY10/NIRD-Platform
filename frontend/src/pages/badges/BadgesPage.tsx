import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Trophy,
  Star,
  Target,
  Zap,
  Shield,
  Crown,
  Heart,
  Flame,
  Sparkles,
  Lock,
  Check,
} from 'lucide-react';

// Types
interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  points: number;
  requirement: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

type BadgeCategory = 'missions' | 'team' | 'learning' | 'social' | 'special';
type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

const BadgesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Mock data - Badges
  const badges: Badge[] = [
    // Missions Badges
    {
      id: 1,
      name: 'Premier Pas',
      description: 'Complétez votre première mission',
      icon: 'Star',
      category: 'missions',
      rarity: 'common',
      points: 50,
      requirement: 'Terminer 1 mission',
      earned: true,
      earnedDate: '2025-11-15',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 2,
      name: 'Explorateur',
      description: 'Complétez 10 missions',
      icon: 'Target',
      category: 'missions',
      rarity: 'rare',
      points: 200,
      requirement: 'Terminer 10 missions',
      earned: true,
      earnedDate: '2025-11-28',
      progress: 10,
      maxProgress: 10,
    },
    {
      id: 3,
      name: 'Maître des Missions',
      description: 'Complétez 50 missions',
      icon: 'Trophy',
      category: 'missions',
      rarity: 'epic',
      points: 1000,
      requirement: 'Terminer 50 missions',
      earned: false,
      progress: 24,
      maxProgress: 50,
    },
    {
      id: 4,
      name: 'Légende',
      description: 'Complétez 100 missions',
      icon: 'Crown',
      category: 'missions',
      rarity: 'legendary',
      points: 5000,
      requirement: 'Terminer 100 missions',
      earned: false,
      progress: 24,
      maxProgress: 100,
    },

    // Team Badges
    {
      id: 5,
      name: 'Esprit d\'Équipe',
      description: 'Rejoignez une équipe',
      icon: 'Heart',
      category: 'team',
      rarity: 'common',
      points: 50,
      requirement: 'Rejoindre une équipe',
      earned: true,
      earnedDate: '2025-11-10',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 6,
      name: 'Capitaine',
      description: 'Créez votre propre équipe',
      icon: 'Shield',
      category: 'team',
      rarity: 'rare',
      points: 300,
      requirement: 'Créer une équipe',
      earned: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 7,
      name: 'Chef de File',
      description: 'Menez votre équipe au top 10',
      icon: 'Crown',
      category: 'team',
      rarity: 'epic',
      points: 1500,
      requirement: 'Atteindre le top 10 avec votre équipe',
      earned: false,
      progress: 3,
      maxProgress: 10,
    },

    // Learning Badges
    {
      id: 8,
      name: 'Étudiant Assidu',
      description: 'Consultez 5 ressources',
      icon: 'Sparkles',
      category: 'learning',
      rarity: 'common',
      points: 100,
      requirement: 'Consulter 5 ressources',
      earned: true,
      earnedDate: '2025-11-20',
      progress: 5,
      maxProgress: 5,
    },
    {
      id: 9,
      name: 'Expert en E-Waste',
      description: 'Complétez tous les modules d\'apprentissage',
      icon: 'Award',
      category: 'learning',
      rarity: 'epic',
      points: 2000,
      requirement: 'Terminer tous les modules',
      earned: false,
      progress: 3,
      maxProgress: 8,
    },

    // Social Badges
    {
      id: 10,
      name: 'Communicateur',
      description: 'Participez à 5 discussions',
      icon: 'Zap',
      category: 'social',
      rarity: 'common',
      points: 75,
      requirement: 'Participer à 5 discussions',
      earned: true,
      earnedDate: '2025-11-25',
      progress: 5,
      maxProgress: 5,
    },
    {
      id: 11,
      name: 'Influenceur',
      description: 'Créez 10 posts dans les forums',
      icon: 'Flame',
      category: 'social',
      rarity: 'rare',
      points: 400,
      requirement: 'Créer 10 posts',
      earned: false,
      progress: 3,
      maxProgress: 10,
    },

    // Special Badges
    {
      id: 12,
      name: 'Pionnier',
      description: 'Soyez parmi les 100 premiers utilisateurs',
      icon: 'Star',
      category: 'special',
      rarity: 'legendary',
      points: 10000,
      requirement: 'Être dans les 100 premiers inscrits',
      earned: true,
      earnedDate: '2025-11-01',
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 13,
      name: 'Éclair',
      description: 'Terminez une mission en moins de 5 minutes',
      icon: 'Zap',
      category: 'special',
      rarity: 'epic',
      points: 800,
      requirement: 'Compléter une mission en moins de 5 minutes',
      earned: false,
      progress: 0,
      maxProgress: 1,
    },
  ];

  // Filter badges
  const filteredBadges =
    selectedCategory === 'all'
      ? badges
      : badges.filter((badge) => badge.category === selectedCategory);

  // Stats
  const earnedBadges = badges.filter((b) => b.earned).length;
  const totalBadges = badges.length;
  const totalPoints = badges.filter((b) => b.earned).reduce((sum, b) => sum + b.points, 0);

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Star,
      Target,
      Trophy,
      Crown,
      Heart,
      Shield,
      Sparkles,
      Award,
      Zap,
      Flame,
    };
    return icons[iconName] || Award;
  };

  // Get rarity color
  const getRarityColor = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // Get rarity label
  const getRarityLabel = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'common':
        return 'Commun';
      case 'rare':
        return 'Rare';
      case 'epic':
        return 'Épique';
      case 'legendary':
        return 'Légendaire';
      default:
        return 'Commun';
    }
  };

  // Get category label
  const getCategoryLabel = (category: BadgeCategory) => {
    switch (category) {
      case 'missions':
        return 'Missions';
      case 'team':
        return 'Équipe';
      case 'learning':
        return 'Apprentissage';
      case 'social':
        return 'Social';
      case 'special':
        return 'Spécial';
      default:
        return 'Tous';
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Badges</h1>
                <p className="text-gray-600 mt-1">
                  Collectionnez des badges en accomplissant des défis
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Badges Gagnés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {earnedBadges} / {totalBadges}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points de Badges</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progression</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((earnedBadges / totalBadges) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedCategory('missions')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'missions'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Missions
              </button>
              <button
                onClick={() => setSelectedCategory('team')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'team'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Équipe
              </button>
              <button
                onClick={() => setSelectedCategory('learning')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'learning'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Apprentissage
              </button>
              <button
                onClick={() => setSelectedCategory('social')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'social'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Social
              </button>
              <button
                onClick={() => setSelectedCategory('special')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === 'special'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Spécial
              </button>
            </div>
          </motion.div>

          {/* Badges Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredBadges.map((badge) => {
              const IconComponent = getIconComponent(badge.icon);
              const rarityColor = getRarityColor(badge.rarity);

              return (
                <motion.div
                  key={badge.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`relative bg-white rounded-xl p-6 shadow-lg border-2 cursor-pointer transition-all ${
                    badge.earned
                      ? 'border-yellow-400 hover:shadow-xl'
                      : 'border-gray-200 opacity-60 hover:opacity-80'
                  }`}
                >
                  {/* Earned Badge Checkmark */}
                  {badge.earned && (
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Locked Badge Overlay */}
                  {!badge.earned && (
                    <div className="absolute top-3 right-3 bg-gray-400 rounded-full p-1">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Badge Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${rarityColor} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>

                  {/* Badge Name */}
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    {badge.name}
                  </h3>

                  {/* Badge Description */}
                  <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Rarity Badge */}
                  <div className="flex justify-center mb-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColor}`}
                    >
                      {getRarityLabel(badge.rarity)}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {badge.points} pts
                    </span>
                  </div>

                  {/* Progress Bar (for unearned badges) */}
                  {!badge.earned && badge.maxProgress && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>
                          {badge.progress} / {badge.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${((badge.progress || 0) / badge.maxProgress) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Earned Date */}
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Obtenu le {new Date(badge.earnedDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              {/* Badge Icon */}
              <div
                className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${getRarityColor(
                  selectedBadge.rarity
                )} rounded-full flex items-center justify-center shadow-2xl`}
              >
                {(() => {
                  const IconComponent = getIconComponent(selectedBadge.icon);
                  return <IconComponent className="w-16 h-16 text-white" />;
                })()}
              </div>

              {/* Badge Status */}
              {selectedBadge.earned ? (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-green-600">Badge Obtenu!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="bg-gray-400 rounded-full p-2">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-600">Badge Verrouillé</span>
                </div>
              )}

              {/* Badge Info */}
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                {selectedBadge.name}
              </h2>
              <p className="text-gray-600 text-center mb-6">{selectedBadge.description}</p>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Catégorie</span>
                  <span className="font-semibold text-gray-900">
                    {getCategoryLabel(selectedBadge.category)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Rareté</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(
                      selectedBadge.rarity
                    )}`}
                  >
                    {getRarityLabel(selectedBadge.rarity)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Points</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      {selectedBadge.points} pts
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Exigence</p>
                  <p className="font-semibold text-gray-900">{selectedBadge.requirement}</p>
                </div>
              </div>

              {/* Progress */}
              {!selectedBadge.earned && selectedBadge.maxProgress && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Progression</span>
                    <span className="font-semibold">
                      {selectedBadge.progress} / {selectedBadge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          ((selectedBadge.progress || 0) / selectedBadge.maxProgress) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Earned Date */}
              {selectedBadge.earned && selectedBadge.earnedDate && (
                <p className="text-center text-sm text-gray-500 mb-6">
                  Obtenu le {new Date(selectedBadge.earnedDate).toLocaleDateString('fr-FR')}
                </p>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgesPage;
