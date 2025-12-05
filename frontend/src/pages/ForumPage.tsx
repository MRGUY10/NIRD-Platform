import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  PlusCircle,
  Eye,
  MessageCircle,
  Pin,
  Lock,
  Loader2
} from 'lucide-react';
import { forumService } from '../services/forumService';
import { useAuthStore } from '../store/authStore';

export default function ForumPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: () => forumService.getPosts({ limit: 50 }),
  });

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Forum de Discussion</h1>
            <p className="text-teal-100">Partagez vos idées et posez vos questions</p>
          </div>
          <Link to="/forum/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-teal-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Nouvelle Discussion
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans le forum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-100">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune discussion trouvée</p>
            <p className="text-gray-400 text-sm mt-2">Soyez le premier à créer une discussion!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Link key={post.id} to={`/forum/${post.id}`}>
              <motion.div
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-6 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {post.author?.full_name?.charAt(0) || 'U'}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.is_pinned && (
                            <Pin className="w-4 h-4 text-teal-600" />
                          )}
                          {post.is_locked && (
                            <Lock className="w-4 h-4 text-gray-600" />
                          )}
                          <h3 className="text-lg font-bold text-gray-900 hover:text-teal-600 transition-colors">
                            {post.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    {/* Post Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                      <span className="font-medium text-gray-700">
                        {post.author?.full_name || 'Anonymous'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comment_count || 0}
                      </span>
                      <span className="text-xs">
                        {new Date(post.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
