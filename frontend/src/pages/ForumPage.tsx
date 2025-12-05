import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  PlusCircle,
  Eye,
  MessageCircle,
  ThumbsUp,
  Clock,
  User,
  Loader2,
  Send,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import { forumService } from '../services/forumService';
import { useAuthStore } from '../store/authStore';

export default function ForumPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: () => forumService.getPosts({ limit: 50 }),
  });

  const { data: postComments = [] } = useQuery({
    queryKey: ['post-comments', selectedPost?.id],
    queryFn: () => forumService.getPostComments(selectedPost.id),
    enabled: !!selectedPost,
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category_id: number }) =>
      forumService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setShowNewPostModal(false);
      setNewPostTitle('');
      setNewPostContent('');
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      forumService.createComment(selectedPost.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', selectedPost.id] });
      setNewComment('');
    },
  });

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      createPostMutation.mutate({
        title: newPostTitle,
        content: newPostContent,
        category_id: 1, // Default category
      });
    }
  };

  const handleCreateComment = () => {
    if (newComment.trim()) {
      createCommentMutation.mutate({ content: newComment });
    }
  };

  const filteredPosts = posts.filter((post: any) =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Forum de Discussion</h1>
            <p className="text-teal-100">Partagez vos idées et posez vos questions</p>
            <div className="flex items-center gap-4 mt-4 text-teal-100">
              <span className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {posts.length} discussions
              </span>
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Communauté active
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewPostModal(true)}
            className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle Discussion
          </motion.button>
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
          filteredPosts.map((post: any) => (
            <motion.div
              key={post.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              onClick={() => setSelectedPost(post)}
              className="p-6 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Author Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {post.author?.full_name?.charAt(0) || post.author?.username?.charAt(0) || 'U'}
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">{post.author?.full_name || post.author?.username}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-3">{post.content}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      {post.comment_count || 0} commentaires
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      {post.view_count || 0} vues
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewPostModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Discussion</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Donnez un titre à votre discussion..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contenu</label>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Écrivez votre message..."
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostTitle.trim() || !newPostContent.trim() || createPostMutation.isPending}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {createPostMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Publier
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Details Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
            >
              {/* Post Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedPost.title}</h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedPost.author?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedPost.author?.full_name || selectedPost.author?.username}</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedPost.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-8 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Comments Section */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Commentaires ({postComments.length})
                </h3>

                {/* Comment Input */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleCreateComment}
                          disabled={!newComment.trim() || createCommentMutation.isPending}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {createCommentMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Commenter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {postComments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Aucun commentaire pour le moment. Soyez le premier à commenter!</p>
                  ) : (
                    postComments.map((comment: any) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {comment.author?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{comment.author?.full_name || comment.author?.username}</p>
                            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}