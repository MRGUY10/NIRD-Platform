import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  X,
  Filter,
  Award,
  Trophy,
  Target,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Book,
  Shield,
} from 'lucide-react';

// Types
interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  school: string;
  class: string;
  team: string | null;
  level: number;
  points: number;
  missionsCompleted: number;
  badges: number;
  joinedDate: string;
  lastActive: string;
  avatar: string;
  status: 'active' | 'inactive';
}

const TeacherStudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock data - Students
  const students: Student[] = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@school.fr',
      phone: '06 12 34 56 78',
      school: 'Lycée Victor Hugo',
      class: 'Terminale A',
      team: 'Éco-Warriors',
      level: 15,
      points: 1850,
      missionsCompleted: 24,
      badges: 8,
      joinedDate: '2025-09-01',
      lastActive: '2025-12-04',
      avatar: 'MD',
      status: 'active',
    },
    {
      id: 2,
      name: 'Lucas Martin',
      email: 'lucas.martin@school.fr',
      phone: '06 23 45 67 89',
      school: 'Lycée Victor Hugo',
      class: 'Terminale A',
      team: 'Green Guardians',
      level: 14,
      points: 1720,
      missionsCompleted: 22,
      badges: 7,
      joinedDate: '2025-09-01',
      lastActive: '2025-12-05',
      avatar: 'LM',
      status: 'active',
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@school.fr',
      phone: '06 34 56 78 90',
      school: 'Lycée Victor Hugo',
      class: 'Première B',
      team: 'Équipe Alpha',
      level: 13,
      points: 1650,
      missionsCompleted: 21,
      badges: 6,
      joinedDate: '2025-09-05',
      lastActive: '2025-12-04',
      avatar: 'SB',
      status: 'active',
    },
    {
      id: 4,
      name: 'Thomas Petit',
      email: 'thomas.petit@school.fr',
      phone: '06 45 67 89 01',
      school: 'Lycée Victor Hugo',
      class: 'Terminale A',
      team: 'Les Recycleurs',
      level: 13,
      points: 1580,
      missionsCompleted: 20,
      badges: 6,
      joinedDate: '2025-09-02',
      lastActive: '2025-12-03',
      avatar: 'TP',
      status: 'active',
    },
    {
      id: 5,
      name: 'Emma Rousseau',
      email: 'emma.rousseau@school.fr',
      phone: '06 56 78 90 12',
      school: 'Lycée Victor Hugo',
      class: 'Première B',
      team: 'Cyber Éco',
      level: 12,
      points: 1450,
      missionsCompleted: 19,
      badges: 5,
      joinedDate: '2025-09-08',
      lastActive: '2025-12-05',
      avatar: 'ER',
      status: 'active',
    },
    {
      id: 6,
      name: 'Hugo Leroy',
      email: 'hugo.leroy@school.fr',
      phone: '06 67 89 01 23',
      school: 'Lycée Victor Hugo',
      class: 'Terminale C',
      team: null,
      level: 10,
      points: 980,
      missionsCompleted: 12,
      badges: 4,
      joinedDate: '2025-09-15',
      lastActive: '2025-11-20',
      avatar: 'HL',
      status: 'inactive',
    },
    {
      id: 7,
      name: 'Chloé Moreau',
      email: 'chloe.moreau@school.fr',
      phone: '06 78 90 12 34',
      school: 'Lycée Victor Hugo',
      class: 'Première B',
      team: 'E-Waste Heroes',
      level: 11,
      points: 1320,
      missionsCompleted: 17,
      badges: 5,
      joinedDate: '2025-09-10',
      lastActive: '2025-12-04',
      avatar: 'CM',
      status: 'active',
    },
    {
      id: 8,
      name: 'Alexandre Simon',
      email: 'alexandre.simon@school.fr',
      phone: '06 89 01 23 45',
      school: 'Lycée Victor Hugo',
      class: 'Terminale C',
      team: 'Digital Eco',
      level: 11,
      points: 1250,
      missionsCompleted: 16,
      badges: 5,
      joinedDate: '2025-09-12',
      lastActive: '2025-12-05',
      avatar: 'AS',
      status: 'active',
    },
  ];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.team?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Get unique classes
  const classes = ['all', ...Array.from(new Set(students.map((s) => s.class)))];

  // Get status color
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Actif' : 'Inactif';
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
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Gestion des Étudiants</h1>
                <p className="text-gray-600 mt-1">
                  Suivez et gérez vos étudiants
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
                  <p className="text-sm text-gray-600">Total Étudiants</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter((s) => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce((sum, s) => sum + s.points, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Missions Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce((sum, s) => sum + s.missionsCompleted, 0)}
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
                  placeholder="Rechercher des étudiants..."
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

              {/* Class Filter */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Book className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Classe</span>
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls === 'all' ? 'Toutes les classes' : cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Statut</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'all'
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setSelectedStatus('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'active'
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Actifs
                  </button>
                  <button
                    onClick={() => setSelectedStatus('inactive')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === 'inactive'
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Inactifs
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Students Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedStudent(student)}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {getStatusLabel(student.status)}
                  </span>
                </div>

                {/* Team */}
                {student.team && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Équipe</p>
                    <p className="font-semibold text-purple-700">{student.team}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{student.level}</p>
                    <p className="text-xs text-gray-600">Niveau</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{student.points}</p>
                    <p className="text-xs text-gray-600">Points</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{student.missionsCompleted}</p>
                    <p className="text-xs text-gray-600">Missions</p>
                  </div>
                </div>

                {/* Badges Count */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{student.badges} badges</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Actif {new Date(student.lastActive).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredStudents.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun étudiant trouvé</h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedStudent(null)}
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {selectedStudent.avatar}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedStudent.name}</h2>
                <p className="text-gray-600 mb-2">{selectedStudent.class}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedStudent.status)}`}>
                  {getStatusLabel(selectedStudent.status)}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Téléphone</p>
                  <p className="font-semibold text-gray-900">{selectedStudent.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">École</p>
                  <p className="font-semibold text-gray-900">{selectedStudent.school}</p>
                </div>
              </div>
            </div>

            {/* Team */}
            {selectedStudent.team && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Équipe</p>
                <p className="text-lg font-bold text-purple-700">{selectedStudent.team}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.level}</p>
                <p className="text-sm text-gray-600">Niveau</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.points}</p>
                <p className="text-sm text-gray-600">Points</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.missionsCompleted}</p>
                <p className="text-sm text-gray-600">Missions</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.badges}</p>
                <p className="text-sm text-gray-600">Badges</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Inscrit le</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedStudent.joinedDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Dernière activité</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedStudent.lastActive).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherStudentsPage;
