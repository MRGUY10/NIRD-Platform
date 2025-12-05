import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  Tag,
  Hash,
  Palette,
  Target,
} from 'lucide-react';

// Types
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  missionCount: number;
}

const AdminCategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});

  // Mock data - Categories
  const categories: Category[] = [
    {
      id: 1,
      name: 'Collecte de Déchets',
      slug: 'collecte-dechets',
      description: 'Missions de collecte et tri des déchets électroniques',
      icon: '🗑️',
      color: '#3B82F6',
      missionCount: 8,
    },
    {
      id: 2,
      name: 'Sensibilisation',
      slug: 'sensibilisation',
      description: 'Actions de communication et sensibilisation du public',
      icon: '📢',
      color: '#10B981',
      missionCount: 12,
    },
    {
      id: 3,
      name: 'Événements',
      slug: 'evenements',
      description: 'Organisation d\'ateliers et événements éducatifs',
      icon: '🎪',
      color: '#F59E0B',
      missionCount: 6,
    },
    {
      id: 4,
      name: 'Recherche',
      slug: 'recherche',
      description: 'Enquêtes et études sur les pratiques de recyclage',
      icon: '🔬',
      color: '#8B5CF6',
      missionCount: 5,
    },
    {
      id: 5,
      name: 'Réparation',
      slug: 'reparation',
      description: 'Ateliers de réparation et réutilisation d\'appareils',
      icon: '🔧',
      color: '#EF4444',
      missionCount: 4,
    },
    {
      id: 6,
      name: 'Innovation',
      slug: 'innovation',
      description: 'Projets créatifs et solutions innovantes',
      icon: '💡',
      color: '#EC4899',
      missionCount: 3,
    },
    {
      id: 7,
      name: 'Partenariat',
      slug: 'partenariat',
      description: 'Collaborations avec organisations et entreprises',
      icon: '🤝',
      color: '#14B8A6',
      missionCount: 2,
    },
    {
      id: 8,
      name: 'Formation',
      slug: 'formation',
      description: 'Sessions de formation et développement de compétences',
      icon: '📚',
      color: '#6366F1',
      missionCount: 4,
    },
  ];

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle create category
  const handleCreateCategory = () => {
    console.log('Creating category:', formData);
    setIsCreateModalOpen(false);
    setFormData({});
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setFormData(category);
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    console.log('Saving category edits:', formData);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setFormData({});
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId: number) => {
    console.log('Deleting category:', categoryId);
    setSelectedCategory(null);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <FolderTree className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Gestion des Catégories</h1>
                  <p className="text-gray-600 mt-1">
                    Gérer les catégories de missions
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFormData({ color: '#3B82F6', icon: '📁' });
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter une Catégorie
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FolderTree className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Catégories Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Missions Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.reduce((sum, c) => sum + c.missionCount, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Missions par Catégorie</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(categories.reduce((sum, c) => sum + c.missionCount, 0) / categories.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          </motion.div>

          {/* Categories Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
                style={{ borderTopColor: category.color, borderTopWidth: '4px' }}
              >
                {/* Category Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl">{category.icon}</div>
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Tag className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono">{category.slug}</span>
                  </div>
                </div>

                {/* Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Mission Count */}
                <div 
                  className="rounded-lg p-3 mb-4"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: category.color }}>
                      Missions
                    </span>
                    <span className="text-2xl font-bold" style={{ color: category.color }}>
                      {category.missionCount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <Tag className="w-4 h-4" />
                    Détails
                  </button>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-white rounded-xl"
            >
              <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune catégorie trouvée</h3>
              <p className="text-gray-600">
                Essayez de modifier votre recherche
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Category Detail Modal */}
      <AnimatePresence>
        {selectedCategory && !isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${selectedCategory.color}20` }}
                >
                  {selectedCategory.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedCategory.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-4 h-4" />
                    <span className="font-mono text-sm">{selectedCategory.slug}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">
                  {selectedCategory.description || 'Aucune description disponible'}
                </p>
              </div>

              {/* Properties */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Propriétés</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">Couleur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedCategory.color }}
                      />
                      <span className="font-mono text-sm text-gray-600">{selectedCategory.color}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">Icône</span>
                    </div>
                    <span className="text-2xl">{selectedCategory.icon}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">Missions</span>
                    </div>
                    <span className="text-xl font-bold" style={{ color: selectedCategory.color }}>
                      {selectedCategory.missionCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleEditCategory(selectedCategory);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Category Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
              setFormData({});
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
                {isCreateModalOpen ? 'Ajouter une Catégorie' : 'Modifier la Catégorie'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la catégorie</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Collecte de Déchets"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                      placeholder="collecte-dechets"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Utilisé dans les URLs (lettres minuscules et tirets uniquement)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Description de la catégorie..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Icône (Emoji)</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-2xl text-center"
                      placeholder="🗑️"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Couleur (Hex)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.color || '#3B82F6'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color || '#3B82F6'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aperçu</label>
                  <div 
                    className="border-2 rounded-xl p-6"
                    style={{ 
                      borderTopColor: formData.color || '#3B82F6',
                      borderTopWidth: '4px'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{formData.icon || '📁'}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{formData.name || 'Nom de la catégorie'}</h3>
                        <p className="text-sm text-gray-500 font-mono">#{formData.slug || 'slug'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{formData.description || 'Description...'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={isCreateModalOpen ? handleCreateCategory : handleSaveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  {isCreateModalOpen ? 'Créer' : 'Enregistrer'}
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setFormData({});
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

export default AdminCategoriesPage;
