import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Video, 
  Link as LinkIcon,
  Download,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { resourceService } from '../services/resourceService';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources', typeFilter],
    queryFn: () => resourceService.getResources({ 
      resource_type: typeFilter || undefined,
      limit: 50 
    }),
  });

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Video className="w-8 h-8 text-red-600" />;
      case 'link': return <LinkIcon className="w-8 h-8 text-blue-600" />;
      default: return <FileText className="w-8 h-8 text-green-600" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return 'from-red-50 to-pink-50 border-red-200 hover:border-red-400';
      case 'link': return 'from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400';
      default: return 'from-green-50 to-emerald-50 border-green-200 hover:border-green-400';
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Ressources Éducatives</h1>
        <p className="text-indigo-100">Documents, vidéos et liens utiles pour vos missions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
            >
              <option value="">Tous les types</option>
              <option value="document">Documents</option>
              <option value="video">Vidéos</option>
              <option value="link">Liens</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune ressource trouvée</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`bg-gradient-to-br ${getResourceColor(resource.resource_type)} rounded-xl p-6 border-2 transition-all cursor-pointer`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-white rounded-lg shadow-md">
                  {getResourceIcon(resource.resource_type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {resource.title}
                  </h3>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {resource.resource_type}
                  </span>
                </div>
              </div>

              {resource.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {resource.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {resource.download_count} téléchargements
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => resourceService.trackDownload(resource.id)}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Accéder
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
