import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  TrendingUp,
  Clock,
  User,
  Send,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { forumService, type ForumPost as ApiForumPost, type CommentWithAuthor } from '../../services/forumService';

type ForumCategory = 'general' | 'questions' | 'tips' | 'projects' | 'announcements';
type SortBy = 'recent' | 'popular' | 'unanswered';

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectedPost, setSelectedPost] = useState<ApiForumPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<ForumCategory>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<ApiForumPost[]>([]);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);

  // Load posts from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await forumService.listPosts({ search: searchQuery || undefined });
        if (!mounted) return;
        setPosts(data);
      } catch (e: any) {
        if (mounted) setError(e.message || 'Erreur lors du chargement des posts');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [searchQuery]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    const arr = [...posts];
    if (sortBy === 'recent') {
      arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'popular') {
      arr.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'unanswered') {
      arr.sort((a, b) => (a.comments_count || 0) - (b.comments_count || 0));
    }
    return arr;
  }, [posts, sortBy]);

  // Get category label
  const getCategoryLabel = (category: ForumCategory) => {
    switch (category) {
      case 'general':
        return 'Général';
      case 'questions':
        return 'Questions';
      case 'tips':
        return 'Astuces';
      case 'projects':
        return 'Projets';
      case 'announcements':
        return 'Annonces';
      default:
        return 'Général';
    }
  };

  // Get category color
  const getCategoryColor = (category: ForumCategory) => {
    switch (category) {
      case 'general':
        return 'bg-gray-100 text-gray-700';
      case 'questions':
        return 'bg-blue-100 text-blue-700';
      case 'tips':
        return 'bg-green-100 text-green-700';
      case 'projects':
        return 'bg-purple-100 text-purple-700';
      case 'announcements':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: 'student' | 'teacher' | 'admin') => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'teacher':
        return 'bg-blue-500';
      case 'student':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get role label
  const getRoleLabel = (role: 'student' | 'teacher' | 'admin') => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'teacher':
        return 'Enseignant';
      case 'student':
        return 'Étudiant';
      default:
        return '';
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

  // Handle create post
  const handleCreatePost = async () => {
    try {
      await forumService.createPost({ title: newPostTitle, content: newPostContent });
      const data = await forumService.listPosts({ search: searchQuery || undefined });
      setPosts(data);
      setShowCreateModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('general');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle submit reply
  const handleSubmitReply = async () => {
    if (!selectedPost) return;
    try {
      await forumService.createComment(selectedPost.id, { content: replyContent });
      const data = await forumService.getComments(selectedPost.id);
      setComments(data);
      setReplyContent('');
    } catch (e) {
      console.error(e);
    }
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
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Forum</h1>
                  <p className="text-gray-600 mt-1">
                    Discutez et partagez avec la communauté
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Nouveau Post
              </button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des discussions..."
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

            <div className="flex flex-wrap gap-4">
              {/* Category Filters */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Catégorie</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setSelectedCategory('general')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'general'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Général
                  </button>
                  <button
                    onClick={() => setSelectedCategory('questions')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'questions'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Questions
                  </button>
                  <button
                    onClick={() => setSelectedCategory('tips')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'tips'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Astuces
                  </button>
                  <button
                    onClick={() => setSelectedCategory('projects')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'projects'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Projets
                  </button>
                  <button
                    onClick={() => setSelectedCategory('announcements')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'announcements'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Annonces
                  </button>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Trier par</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Plus Récents</option>
                  <option value="popular">Plus Populaires</option>
                  <option value="unanswered">Sans Réponses</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Posts List */}
          <motion.div variants={containerVariants} className="space-y-4">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                onClick={async () => {
                  setSelectedPost(post);
                  try {
                    const data = await forumService.getComments(post.id);
                    setComments(data);
                  } catch {}
                }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(post.author?.full_name || post.author?.username || 'U')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.is_pinned && (
                            <Pin className="w-4 h-4 text-orange-500" />
                          )}
                          {post.is_locked && (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="font-medium">{post.author?.full_name || post.author?.username || 'Utilisateur'}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getRoleBadgeColor((post.author?.role || 'student') as any)}`}>
                            {getRoleLabel((post.author?.role || 'student') as any)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(post.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      {/* Category pill omitted due to missing category names */}
                    </div>

                    {/* Content Preview */}
                    <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>

                    {/* Tags omitted */}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments_count || 0} réponses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun post trouvé</h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou créez le premier post!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {(selectedPost.author?.full_name || selectedPost.author?.username || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedPost.is_pinned && <Pin className="w-5 h-5 text-orange-500" />}
                    {selectedPost.is_locked && <Lock className="w-5 h-5 text-gray-400" />}
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold">{selectedPost.author?.full_name || selectedPost.author?.username || 'Utilisateur'}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRoleBadgeColor((selectedPost.author?.role || 'student') as any)}`}>
                      {getRoleLabel((selectedPost.author?.role || 'student') as any)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedPost.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                {/* Category pill omitted */}
              </div>

              {/* Post Content */}
              <div className="mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {/* Tags omitted */}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">{selectedPost.views} vues</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">{selectedPost.comments_count || 0} réponses</span>
                </div>
              </div>

              {/* Replies */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Réponses ({comments.length})
                </h3>
                <div className="space-y-4">
                  {comments.map((reply) => (
                    <div key={reply.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(reply.author?.full_name || reply.author?.username || 'U').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{reply.author?.full_name || reply.author?.username || 'Utilisateur'}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getRoleBadgeColor((reply.author?.role || 'student') as any)}`}>
                            {getRoleLabel((reply.author?.role || 'student') as any)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              {!selectedPost.isLocked && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ajouter une réponse
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={handleSubmitReply}
                    className="mt-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer
                  </button>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un Nouveau Post</h2>

              <div className="space-y-4 mb-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Titre de votre post..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value as ForumCategory)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">Général</option>
                    <option value="questions">Question</option>
                    <option value="tips">Astuce</option>
                    <option value="projects">Projet</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contenu
                  </label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Écrivez votre message..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCreatePost}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Publier
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
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

export default ForumPage;
