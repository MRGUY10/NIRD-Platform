import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  School,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  GraduationCap,
  Award,
} from 'lucide-react';

// Types
interface SchoolData {
  id: number;
  name: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  teamCount: number;
  studentCount: number;
  totalPoints: number;
}

const AdminSchoolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SchoolData>>({});

  // Mock data - Schools
  const schools: SchoolData[] = [
    {
      id: 1,
      name: 'Lycée Victor Hugo',
      address: '15 Rue Victor Hugo',
      city: 'Paris',
      region: 'Île-de-France',
      postalCode: '75016',
      country: 'France',
      email: 'contact@lycee-hugo.fr',
      phone: '01 45 67 89 01',
      website: 'https://lycee-hugo.fr',
      description: 'Lycée général et technologique situé dans le 16ème arrondissement de Paris',
      logoUrl: null,
      teamCount: 24,
      studentCount: 156,
      totalPoints: 45600,
    },
    {
      id: 2,
      name: 'Collège Marie Curie',
      address: '28 Avenue Marie Curie',
      city: 'Lyon',
      region: 'Auvergne-Rhône-Alpes',
      postalCode: '69003',
      country: 'France',
      email: 'accueil@college-curie.fr',
      phone: '04 78 12 34 56',
      website: 'https://college-curie.fr',
      description: 'Collège d\'enseignement général',
      logoUrl: null,
      teamCount: 18,
      studentCount: 108,
      totalPoints: 32400,
    },
    {
      id: 3,
      name: 'Lycée Jules Ferry',
      address: '42 Boulevard Jules Ferry',
      city: 'Marseille',
      region: 'Provence-Alpes-Côte d\'Azur',
      postalCode: '13001',
      country: 'France',
      email: 'info@lycee-ferry.fr',
      phone: '04 91 23 45 67',
      website: null,
      description: null,
      logoUrl: null,
      teamCount: 15,
      studentCount: 95,
      totalPoints: 28500,
    },
    {
      id: 4,
      name: 'Collège Jean Moulin',
      address: '7 Rue Jean Moulin',
      city: 'Toulouse',
      region: 'Occitanie',
      postalCode: '31000',
      country: 'France',
      email: 'contact@college-moulin.fr',
      phone: '05 61 34 56 78',
      website: 'https://college-moulin.fr',
      description: 'Collège public',
      logoUrl: null,
      teamCount: 12,
      studentCount: 78,
      totalPoints: 23400,
    },
    {
      id: 5,
      name: 'Lycée Pasteur',
      address: '33 Avenue Pasteur',
      city: 'Bordeaux',
      region: 'Nouvelle-Aquitaine',
      postalCode: '33000',
      country: 'France',
      email: 'secretariat@lycee-pasteur.fr',
      phone: '05 56 78 90 12',
      website: 'https://lycee-pasteur.fr',
      description: 'Lycée polyvalent',
      logoUrl: null,
      teamCount: 10,
      studentCount: 67,
      totalPoints: 20100,
    },
  ];

  // Filter schools
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create school
  const handleCreateSchool = () => {
    console.log('Creating school:', formData);
    setIsCreateModalOpen(false);
    setFormData({});
  };

  // Handle edit school
  const handleEditSchool = (school: SchoolData) => {
    setFormData(school);
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    console.log('Saving school edits:', formData);
    setIsEditModalOpen(false);
    setSelectedSchool(null);
    setFormData({});
  };

  // Handle delete school
  const handleDeleteSchool = (schoolId: number) => {
    console.log('Deleting school:', schoolId);
    setSelectedSchool(null);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <School className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Gestion des Établissements</h1>
                  <p className="text-gray-600 mt-1">
                    Gérer les écoles et lycées participants
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFormData({});
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter une École
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <School className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Établissements</p>
                  <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Équipes Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schools.reduce((sum, s) => sum + s.teamCount, 0)}
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
                    {schools.reduce((sum, s) => sum + s.studentCount, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schools.reduce((sum, s) => sum + s.totalPoints, 0).toLocaleString()}
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
                placeholder="Rechercher par nom, ville ou région..."
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
          </motion.div>

          {/* Schools Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <motion.div
                key={school.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
              >
                {/* School Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <School className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{school.name}</h3>
                        <p className="text-sm text-gray-600">{school.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{school.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{school.postalCode} {school.city}</span>
                    <span className="text-gray-400">•</span>
                    <span>{school.region}</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-4 space-y-2">
                  {school.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{school.email}</span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{school.phone}</span>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Globe className="w-4 h-4" />
                      <a href={school.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                        Site web
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{school.teamCount}</p>
                    <p className="text-xs text-gray-600">Équipes</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <GraduationCap className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{school.studentCount}</p>
                    <p className="text-xs text-gray-600">Élèves</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <Award className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{(school.totalPoints / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-600">Points</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSchool(school)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() => handleEditSchool(school)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteSchool(school.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredSchools.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-white rounded-xl"
            >
              <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun établissement trouvé</h3>
              <p className="text-gray-600">
                Essayez de modifier votre recherche
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* School Detail Modal */}
      <AnimatePresence>
        {selectedSchool && !isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSchool(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <School className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedSchool.name}</h2>
                  <p className="text-gray-600">{selectedSchool.city}, {selectedSchool.region}</p>
                </div>
              </div>

              {/* Description */}
              {selectedSchool.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedSchool.description}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Informations de Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{selectedSchool.address}</p>
                      <p className="text-gray-600">{selectedSchool.postalCode} {selectedSchool.city}</p>
                      <p className="text-gray-600">{selectedSchool.region}, {selectedSchool.country}</p>
                    </div>
                  </div>
                  {selectedSchool.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${selectedSchool.email}`} className="text-blue-600 hover:underline">
                        {selectedSchool.email}
                      </a>
                    </div>
                  )}
                  {selectedSchool.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`tel:${selectedSchool.phone}`} className="text-blue-600 hover:underline">
                        {selectedSchool.phone}
                      </a>
                    </div>
                  )}
                  {selectedSchool.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedSchool.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Statistiques</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{selectedSchool.teamCount}</p>
                    <p className="text-sm text-gray-600">Équipes</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{selectedSchool.studentCount}</p>
                    <p className="text-sm text-gray-600">Élèves</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                    <Award className="w-8 h-8 text-orange-600 mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{selectedSchool.totalPoints.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleEditSchool(selectedSchool);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit School Modal */}
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
              className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isCreateModalOpen ? 'Ajouter un Établissement' : 'Modifier l\'Établissement'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'établissement</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Lycée Victor Hugo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="15 Rue Victor Hugo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Code Postal</label>
                  <input
                    type="text"
                    value={formData.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="75016"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Région</label>
                  <input
                    type="text"
                    value={formData.region || ''}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Île-de-France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pays</label>
                  <input
                    type="text"
                    value={formData.country || 'France'}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="contact@lycee.fr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="01 45 67 89 01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Web</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://lycee.fr"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Description de l'établissement..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={isCreateModalOpen ? handleCreateSchool : handleSaveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
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

export default AdminSchoolsPage;
