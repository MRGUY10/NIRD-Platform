import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Edit2, Trash2, Eye, UserCheck, UserX, Download, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { userService } from '../../services/userService';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers', roleFilter],
    queryFn: () => adminService.getUsers(roleFilter !== 'all' ? { role: roleFilter } : {}),
  });

  // Fetch user rankings with stats
  const { data: userRankings } = useQuery({
    queryKey: ['userRankings'],
    queryFn: () => userService.getRankings({ limit: 100 }),
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userRankings'] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setShowModal(false);
    },
  });

  const filteredUsers = users?.filter((user: any) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user stats from rankings
  const getUserStats = (userId: number) => {
    return userRankings?.find((u: any) => u.id === userId);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleActive = (user: any) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { is_active: !user.is_active },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-green-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">Gérer tous les utilisateurs de la plateforme</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/30 transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/30 transition-all"
              >
                <option value="all">Tous les rôles</option>
                <option value="student">Étudiants</option>
                <option value="teacher">Enseignants</option>
                <option value="admin">Administrateurs</option>
              </select>
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exporter CSV
            </motion.button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-blue-600">{users?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Utilisateurs</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-green-600">
                {users?.filter((u: any) => u.role === 'student').length || 0}
              </div>
              <div className="text-sm text-gray-600">Étudiants</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-purple-600">
                {users?.filter((u: any) => u.role === 'teacher').length || 0}
              </div>
              <div className="text-sm text-gray-600">Enseignants</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-orange-600">
                {users?.filter((u: any) => u.is_active).length || 0}
              </div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rôle</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Points</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Niveau</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Inscription</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers?.map((user: any, index: number) => {
                    const stats = getUserStats(user.id);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                              {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{user.full_name || user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-600' :
                            user.role === 'teacher' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {user.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{stats?.total_points || 0}</div>
                        </td>
                        <td className="px-6 py-4">
                          {stats?.level && (
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: `${stats.level.level_color}20`, 
                                color: stats.level.level_color 
                              }}
                            >
                              {stats.level.level_name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleActive(user)}
                              className={`p-2 hover:bg-gray-50 rounded-lg transition-colors ${
                                user.is_active ? 'text-orange-600' : 'text-green-600'
                              }`}
                              title={user.is_active ? 'Désactiver' : 'Activer'}
                            >
                              {user.is_active ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de l'utilisateur</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Nom complet</label>
                  <p className="text-gray-900">{selectedUser.full_name || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Username</label>
                  <p className="text-gray-900">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Rôle</label>
                  <p className="text-gray-900">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Statut</label>
                  <p className="text-gray-900">{selectedUser.is_active ? 'Actif' : 'Inactif'}</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
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
}
