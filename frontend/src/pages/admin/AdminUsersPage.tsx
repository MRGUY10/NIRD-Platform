import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  X,
  Filter,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  Award,
  Target,
  Shield,
  GraduationCap,
  UserCog,
} from 'lucide-react';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
  teamName: string | null;
  missionsCompleted: number;
  totalPoints: number;
  avatar: string;
}

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  // Mock data - Users
  const users: User[] = [
    {
      id: 1,
      username: 'marie.dubois',
      email: 'marie.dubois@lycee-hugo.fr',
      fullName: 'Marie Dubois',
      role: 'student',
      isActive: true,
      isVerified: true,
      createdAt: '2025-09-15T10:30:00Z',
      lastLogin: '2025-12-05T14:30:00Z',
      teamName: 'Les Éco-Warriors',
      missionsCompleted: 24,
      totalPoints: 1850,
      avatar: 'MD',
    },
    {
      id: 2,
      username: 'lucas.martin',
      email: 'lucas.martin@lycee-hugo.fr',
      fullName: 'Lucas Martin',
      role: 'student',
      isActive: true,
      isVerified: true,
      createdAt: '2025-09-16T11:15:00Z',
      lastLogin: '2025-12-05T09:45:00Z',
      teamName: 'Les Éco-Warriors',
      missionsCompleted: 22,
      totalPoints: 1720,
      avatar: 'LM',
    },
    {
      id: 3,
      username: 'prof.laurent',
      email: 'p.laurent@lycee-hugo.fr',
      fullName: 'Pierre Laurent',
      role: 'teacher',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-01T08:00:00Z',
      lastLogin: '2025-12-05T13:00:00Z',
      teamName: null,
      missionsCompleted: 0,
      totalPoints: 0,
      avatar: 'PL',
    },
    {
      id: 4,
      username: 'sophie.bernard',
      email: 'sophie.bernard@lycee-hugo.fr',
      fullName: 'Sophie Bernard',
      role: 'student',
      isActive: true,
      isVerified: true,
      createdAt: '2025-09-18T14:20:00Z',
      lastLogin: '2025-12-04T16:45:00Z',
      teamName: 'Green Guardians',
      missionsCompleted: 21,
      totalPoints: 1650,
      avatar: 'SB',
    },
    {
      id: 5,
      username: 'admin.system',
      email: 'admin@nird-platform.fr',
      fullName: 'Administrateur Système',
      role: 'admin',
      isActive: true,
      isVerified: true,
      createdAt: '2025-07-01T00:00:00Z',
      lastLogin: '2025-12-05T15:00:00Z',
      teamName: null,
      missionsCompleted: 0,
      totalPoints: 0,
      avatar: 'AS',
    },
    {
      id: 6,
      username: 'emma.rousseau',
      email: 'emma.rousseau@lycee-hugo.fr',
      fullName: 'Emma Rousseau',
      role: 'student',
      isActive: false,
      isVerified: true,
      createdAt: '2025-09-20T10:00:00Z',
      lastLogin: '2025-11-15T12:00:00Z',
      teamName: null,
      missionsCompleted: 8,
      totalPoints: 450,
      avatar: 'ER',
    },
    {
      id: 7,
      username: 'prof.durand',
      email: 'm.durand@lycee-hugo.fr',
      fullName: 'Marie Durand',
      role: 'teacher',
      isActive: true,
      isVerified: true,
      createdAt: '2025-08-05T09:30:00Z',
      lastLogin: '2025-12-05T11:20:00Z',
      teamName: null,
      missionsCompleted: 0,
      totalPoints: 0,
      avatar: 'MD',
    },
    {
      id: 8,
      username: 'thomas.petit',
      email: 'thomas.petit@lycee-hugo.fr',
      fullName: 'Thomas Petit',
      role: 'student',
      isActive: true,
      isVerified: false,
      createdAt: '2025-12-01T15:45:00Z',
      lastLogin: '2025-12-03T11:20:00Z',
      teamName: 'Tech Recyclers',
      missionsCompleted: 5,
      totalPoints: 380,
      avatar: 'TP',
    },
  ];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student':
        return 'Étudiant';
      case 'teacher':
        return 'Enseignant';
      case 'admin':
        return 'Administrateur';
      default:
        return role;
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-700';
      case 'teacher':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return GraduationCap;
      case 'teacher':
        return UserCog;
      case 'admin':
        return Shield;
      default:
        return Users;
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId: number) => {
    console.log('Deleting user:', userId);
    setSelectedUser(null);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    });
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    console.log('Saving user edits:', editFormData);
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({});
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600 mt-1">
                  Gérer tous les utilisateurs de la plateforme
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Étudiants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'student').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <UserCog className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enseignants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === 'teacher').length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search Bar */}
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou username..."
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

              {/* Filters */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Filtres</span>
                </div>
                <div className="flex gap-2">
                  {/* Role Filter */}
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="student">Étudiants</option>
                    <option value="teacher">Enseignants</option>
                    <option value="admin">Admins</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Rôle</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Équipe</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Missions</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Points</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.fullName}</p>
                              <p className="text-xs text-gray-500">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{user.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            <RoleIcon className="w-3 h-3" />
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {user.isActive ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                <UserCheck className="w-3 h-3" />
                                Actif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                <UserX className="w-3 h-3" />
                                Inactif
                              </span>
                            )}
                            {!user.isVerified && (
                              <span className="text-xs text-orange-600">Non vérifié</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.teamName ? (
                            <span className="text-sm text-gray-700">{user.teamName}</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-gray-900">{user.missionsCompleted}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-blue-600">{user.totalPoints}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* No Results */}
          {filteredUsers.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-white rounded-xl mt-6"
            >
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && !isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedUser.fullName}</h2>
                  <p className="text-gray-600">@{selectedUser.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {(() => {
                      const RoleIcon = getRoleIcon(selectedUser.role);
                      return (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(selectedUser.role)}`}>
                          <RoleIcon className="w-3 h-3" />
                          {getRoleLabel(selectedUser.role)}
                        </span>
                      );
                    })()}
                    {selectedUser.isActive ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <UserCheck className="w-3 h-3" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        <UserX className="w-3 h-3" />
                        Inactif
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Informations de Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {selectedUser.role === 'student' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Statistiques</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <Target className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{selectedUser.missionsCompleted}</p>
                      <p className="text-xs text-gray-600">Missions</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                      <Award className="w-6 h-6 text-purple-600 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{selectedUser.totalPoints}</p>
                      <p className="text-xs text-gray-600">Points</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                      <Users className="w-6 h-6 text-green-600 mb-2" />
                      <p className="text-lg font-bold text-gray-900">{selectedUser.teamName || 'Aucune'}</p>
                      <p className="text-xs text-gray-600">Équipe</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Informations du Compte</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date de création:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Dernière connexion:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedUser.lastLogin 
                        ? new Date(selectedUser.lastLogin).toLocaleDateString('fr-FR')
                        : 'Jamais'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email vérifié:</span>
                    <span className={`font-semibold ${selectedUser.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedUser.isVerified ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleEditUser(selectedUser);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier l'Utilisateur</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={editFormData.username || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={editFormData.fullName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rôle</label>
                  <select
                    value={editFormData.role || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="student">Étudiant</option>
                    <option value="teacher">Enseignant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive || false}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">Compte actif</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isVerified || false}
                      onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.checked })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">Email vérifié</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
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

export default AdminUsersPage;
