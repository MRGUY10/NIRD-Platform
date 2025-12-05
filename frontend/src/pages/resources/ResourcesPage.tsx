import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Video,
  FileText,
  Link as LinkIcon,
  Search,
  Download,
  Eye,
  Clock,
  Star,
  PlayCircle,
  FileDown,
  ExternalLink,
  Filter,
  X,
} from 'lucide-react';

// Types
interface Resource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  url: string;
  thumbnail?: string;
  duration?: string;
  views: number;
  rating: number;
  publishedDate: string;
  author: string;
  fileSize?: string;
}

type ResourceType = 'video' | 'pdf' | 'article' | 'link';
type ResourceCategory = 'ewaste' | 'recycling' | 'environment' | 'technology' | 'education';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Mock data - Resources
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Introduction aux Déchets Électroniques',
      description:
        'Une introduction complète aux déchets électroniques, leur impact sur l\'environnement et les solutions de recyclage.',
      type: 'video',
      category: 'ewaste',
      url: 'https://example.com/video1',
      thumbnail: '🎥',
      duration: '12:30',
      views: 1245,
      rating: 4.8,
      publishedDate: '2025-10-15',
      author: 'Dr. Marie Leclerc',
    },
    {
      id: 2,
      title: 'Guide du Recyclage des Téléphones',
      description:
        'Un guide détaillé sur comment recycler correctement vos anciens téléphones portables.',
      type: 'pdf',
      category: 'recycling',
      url: 'https://example.com/guide.pdf',
      views: 892,
      rating: 4.6,
      publishedDate: '2025-09-20',
      author: 'Jean Dupont',
      fileSize: '2.4 MB',
    },
    {
      id: 3,
      title: 'L\'Impact des E-Déchets sur l\'Environnement',
      description:
        'Article de recherche sur les effets des déchets électroniques sur notre écosystème.',
      type: 'article',
      category: 'environment',
      url: 'https://example.com/article1',
      views: 2150,
      rating: 4.9,
      publishedDate: '2025-11-05',
      author: 'Sophie Martin',
    },
    {
      id: 4,
      title: 'Technologies de Recyclage Innovantes',
      description:
        'Découvrez les dernières technologies utilisées pour recycler les déchets électroniques.',
      type: 'video',
      category: 'technology',
      url: 'https://example.com/video2',
      thumbnail: '🎬',
      duration: '18:45',
      views: 1567,
      rating: 4.7,
      publishedDate: '2025-10-28',
      author: 'Tech Innovation Lab',
    },
    {
      id: 5,
      title: 'Législation sur les E-Déchets en France',
      description:
        'Guide complet sur les lois et régulations concernant les déchets électroniques en France.',
      type: 'pdf',
      category: 'education',
      url: 'https://example.com/legislation.pdf',
      views: 743,
      rating: 4.5,
      publishedDate: '2025-09-10',
      author: 'Ministère de l\'Environnement',
      fileSize: '1.8 MB',
    },
    {
      id: 6,
      title: 'Centre de Recyclage près de chez vous',
      description:
        'Trouvez les centres de recyclage de déchets électroniques dans votre région.',
      type: 'link',
      category: 'recycling',
      url: 'https://example.com/centers',
      views: 3421,
      rating: 4.9,
      publishedDate: '2025-08-15',
      author: 'Éco-Réseau',
    },
    {
      id: 7,
      title: 'Comment Prolonger la Vie de vos Appareils',
      description:
        'Astuces et conseils pour prolonger la durée de vie de vos appareils électroniques.',
      type: 'video',
      category: 'education',
      url: 'https://example.com/video3',
      thumbnail: '📱',
      duration: '10:15',
      views: 2876,
      rating: 4.8,
      publishedDate: '2025-11-12',
      author: 'Éco-Tech',
    },
    {
      id: 8,
      title: 'Rapport Annuel sur les E-Déchets 2024',
      description:
        'Rapport statistique complet sur la production et le recyclage des e-déchets en 2024.',
      type: 'pdf',
      category: 'environment',
      url: 'https://example.com/report2024.pdf',
      views: 1234,
      rating: 4.7,
      publishedDate: '2025-01-05',
      author: 'Global E-Waste Monitor',
      fileSize: '5.2 MB',
    },
    {
      id: 9,
      title: 'Économie Circulaire et E-Déchets',
      description:
        'Article sur le rôle de l\'économie circulaire dans la gestion des déchets électroniques.',
      type: 'article',
      category: 'environment',
      url: 'https://example.com/article2',
      views: 1876,
      rating: 4.6,
      publishedDate: '2025-10-20',
      author: 'Économie Verte',
    },
    {
      id: 10,
      title: 'Base de Données des Matériaux Recyclables',
      description:
        'Liste complète des matériaux recyclables présents dans les appareils électroniques.',
      type: 'link',
      category: 'technology',
      url: 'https://example.com/materials',
      views: 987,
      rating: 4.5,
      publishedDate: '2025-07-30',
      author: 'RecycleDB',
    },
    {
      id: 11,
      title: 'Tutoriel: Démonter un Ordinateur en Toute Sécurité',
      description:
        'Guide pas à pas pour démonter un ordinateur avant de le recycler.',
      type: 'video',
      category: 'education',
      url: 'https://example.com/video4',
      thumbnail: '💻',
      duration: '22:10',
      views: 1654,
      rating: 4.9,
      publishedDate: '2025-11-20',
      author: 'Tech Repair Academy',
    },
    {
      id: 12,
      title: 'Impact Social du Recyclage des E-Déchets',
      description:
        'Étude sur les avantages sociaux et économiques du recyclage des déchets électroniques.',
      type: 'article',
      category: 'environment',
      url: 'https://example.com/article3',
      views: 1432,
      rating: 4.7,
      publishedDate: '2025-09-25',
      author: 'Institut Social',
    },
  ];

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Get type icon
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return Video;
      case 'pdf':
        return FileText;
      case 'article':
        return BookOpen;
      case 'link':
        return LinkIcon;
      default:
        return BookOpen;
    }
  };

  // Get type label
  const getTypeLabel = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return 'Vidéo';
      case 'pdf':
        return 'PDF';
      case 'article':
        return 'Article';
      case 'link':
        return 'Lien';
      default:
        return 'Ressource';
    }
  };

  // Get category label
  const getCategoryLabel = (category: ResourceCategory) => {
    switch (category) {
      case 'ewaste':
        return 'E-Déchets';
      case 'recycling':
        return 'Recyclage';
      case 'environment':
        return 'Environnement';
      case 'technology':
        return 'Technologie';
      case 'education':
        return 'Éducation';
      default:
        return 'Général';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Ressources</h1>
                <p className="text-gray-600 mt-1">
                  Explorez notre bibliothèque de contenus éducatifs
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des ressources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

            {/* Type Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Type de Ressource</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === 'all'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setSelectedType('video')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedType === 'video'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Vidéos
                </button>
                <button
                  onClick={() => setSelectedType('pdf')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedType === 'pdf'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  PDFs
                </button>
                <button
                  onClick={() => setSelectedType('article')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedType === 'article'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Articles
                </button>
                <button
                  onClick={() => setSelectedType('link')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedType === 'link'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Liens
                </button>
              </div>
            </div>

            {/* Category Filters */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Catégorie</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setSelectedCategory('ewaste')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'ewaste'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  E-Déchets
                </button>
                <button
                  onClick={() => setSelectedCategory('recycling')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'recycling'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Recyclage
                </button>
                <button
                  onClick={() => setSelectedCategory('environment')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'environment'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Environnement
                </button>
                <button
                  onClick={() => setSelectedCategory('technology')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'technology'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Technologie
                </button>
                <button
                  onClick={() => setSelectedCategory('education')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'education'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Éducation
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div variants={itemVariants} className="mb-4">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredResources.length}</span>{' '}
              {filteredResources.length === 1 ? 'ressource trouvée' : 'ressources trouvées'}
            </p>
          </motion.div>

          {/* Resources Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);

              return (
                <motion.div
                  key={resource.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedResource(resource)}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 h-40 flex items-center justify-center">
                    {resource.thumbnail ? (
                      <div className="text-6xl">{resource.thumbnail}</div>
                    ) : (
                      <TypeIcon className="w-16 h-16 text-white" />
                    )}
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <TypeIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-700">
                        {getTypeLabel(resource.type)}
                      </span>
                    </div>
                    {/* Duration (for videos) */}
                    {resource.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs font-semibold">
                        {resource.duration}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        {getCategoryLabel(resource.category)}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{resource.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-700">{resource.rating}</span>
                      </div>
                    </div>

                    {/* Author & Date */}
                    <div className="text-xs text-gray-500">
                      <p className="mb-1">Par {resource.author}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(resource.publishedDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* No Results */}
          {filteredResources.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune ressource trouvée</h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedResource(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Thumbnail */}
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 h-64 rounded-xl flex items-center justify-center mb-6">
                {selectedResource.thumbnail ? (
                  <div className="text-8xl">{selectedResource.thumbnail}</div>
                ) : (
                  (() => {
                    const TypeIcon = getTypeIcon(selectedResource.type);
                    return <TypeIcon className="w-24 h-24 text-white" />;
                  })()
                )}
                {/* Type Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedResource.type);
                    return <TypeIcon className="w-5 h-5 text-green-600" />;
                  })()}
                  <span className="text-sm font-semibold text-gray-700">
                    {getTypeLabel(selectedResource.type)}
                  </span>
                </div>
                {/* Duration */}
                {selectedResource.duration && (
                  <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 rounded-lg text-white text-sm font-semibold">
                    {selectedResource.duration}
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedResource.title}</h2>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                  {getCategoryLabel(selectedResource.category)}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{selectedResource.views} vues</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-900">{selectedResource.rating} / 5</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedResource.description}</p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Auteur</span>
                  <span className="font-semibold text-gray-900">{selectedResource.author}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Date de Publication</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedResource.publishedDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {selectedResource.fileSize && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Taille du Fichier</span>
                    <span className="font-semibold text-gray-900">{selectedResource.fileSize}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedResource.type === 'video' && (
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Regarder
                  </button>
                )}
                {selectedResource.type === 'pdf' && (
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <FileDown className="w-5 h-5" />
                    Télécharger
                  </button>
                )}
                {(selectedResource.type === 'article' || selectedResource.type === 'link') && (
                  <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Ouvrir
                  </button>
                )}
                <button
                  onClick={() => setSelectedResource(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesPage;
