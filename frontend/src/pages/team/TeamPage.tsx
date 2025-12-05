import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  Target,
  Crown,
  UserPlus,
  Plus,
  Copy,
  CheckCircle,
  LogOut,
  Shield,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Mail
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const TeamPage = () => {
  const { user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock team data - will be replaced with API call
  const hasTeam = true;
  const team = {
    id: 1,
    name: 'Équipe Alpha',
    description: 'Nous sommes passionnés par la protection de l\'environnement et le recyclage des déchets électroniques!',
    team_code: 'ALPHA2025',
    total_points: 2850,
    rank: 3,
    missions_completed: 24,
    members: [
      { id: 1, name: 'Marie Dubois', role: 'Capitaine', points: 1200, avatar: '👩‍🎓', joined: '2025-01-01' },
      { id: 2, name: 'Jean Martin', role: 'Membre', points: 950, avatar: '👨‍🎓', joined: '2025-01-05' },
      { id: 3, name: 'Sophie Laurent', role: 'Membre', points: 700, avatar: '👩‍🎓', joined: '2025-01-10' }
    ],
    created_at: '2025-01-01'
  };

  const copyTeamCode = () => {
    navigator.clipboard.writeText(team.team_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!hasTeam) {
    return <NoTeamView onCreateTeam={() => setShowCreateModal(true)} onJoinTeam={() => setShowJoinModal(true)} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Users className="w-10 h-10 text-blue-600" />
            Mon Équipe
          </h1>
          <p className="text-gray-600 mt-2">Travaillez ensemble pour accomplir des missions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Quitter l'Équipe
        </motion.button>
      </motion.div>

      {/* Team Info Card */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-4xl font-extrabold mb-2">{team.name}</h2>
              <p className="text-blue-100 text-lg">{team.description}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl mb-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="font-bold">Rang #{team.rank}</span>
              </div>
            </div>
          </div>

          {/* Team Code */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-white/20 backdrop-blur px-6 py-4 rounded-xl">
              <p className="text-sm text-blue-100 mb-1">Code d'Équipe</p>
              <p className="text-2xl font-bold tracking-wider">{team.team_code}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={copyTeamCode}
              className="p-4 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl transition-all"
            >
              {copiedCode ? (
                <CheckCircle className="w-6 h-6 text-green-300" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-3xl font-extrabold">{team.total_points}</p>
              <p className="text-sm text-blue-100">Points Totaux</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <p className="text-3xl font-extrabold">{team.missions_completed}</p>
              <p className="text-sm text-blue-100">Missions</p>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <p className="text-3xl font-extrabold">{team.members.length}</p>
              <p className="text-sm text-blue-100">Membres</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Members Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Membres de l'Équipe
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Inviter
          </motion.button>
        </div>

        <div className="space-y-3">
          {team.members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="text-4xl">{member.avatar}</div>
                  {member.role === 'Capitaine' && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                      <Crown className="w-3 h-3 text-yellow-900" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    {member.role === 'Capitaine' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                        {member.role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Membre depuis {new Date(member.joined).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                  <Trophy className="w-5 h-5" />
                  {member.points}
                </div>
                <p className="text-sm text-gray-500">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Activité Récente
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Mission complétée', detail: 'Recycler un Vieux Téléphone', points: '+100', time: 'Il y a 2h', member: 'Marie' },
            { action: 'Nouveau membre', detail: 'Sophie a rejoint l\'équipe', time: 'Il y a 5h', member: 'Sophie' },
            { action: 'Badge obtenu', detail: 'Éco-Warrior débloqué', time: 'Hier', member: 'Jean' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                </div>
              </div>
              <div className="text-right">
                {activity.points && (
                  <p className="font-bold text-green-600">{activity.points}</p>
                )}
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && <CreateTeamModal onClose={() => setShowCreateModal(false)} />}
        {showJoinModal && <JoinTeamModal onClose={() => setShowJoinModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

// No Team View Component
interface NoTeamViewProps {
  onCreateTeam: () => void;
  onJoinTeam: () => void;
}

const NoTeamView = ({ onCreateTeam, onJoinTeam }: NoTeamViewProps) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="mb-8">
          <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Vous n'avez pas d'équipe
          </h2>
          <p className="text-xl text-gray-600">
            Rejoignez une équipe existante ou créez la vôtre pour commencer à accomplir des missions ensemble!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={onCreateTeam}
            className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl cursor-pointer hover:border-blue-400 transition-all"
          >
            <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Créer une Équipe</h3>
            <p className="text-gray-600">
              Devenez capitaine et invitez vos amis à rejoindre votre équipe
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={onJoinTeam}
            className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl cursor-pointer hover:border-green-400 transition-all"
          >
            <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rejoindre une Équipe</h3>
            <p className="text-gray-600">
              Utilisez un code d'équipe pour rejoindre vos camarades
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Create Team Modal
interface CreateTeamModalProps {
  onClose: () => void;
}

const CreateTeamModal = ({ onClose }: CreateTeamModalProps) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    console.log('Creating team:', { teamName, description });
    // API call will go here
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Créer une Équipe</h2>
          <p className="text-gray-600">Devenez capitaine et invitez vos amis</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nom de l'Équipe *
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Équipe Alpha"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Décrivez votre équipe..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Un code d'équipe sera généré</p>
                <p className="text-blue-700">Partagez-le avec vos amis pour qu'ils puissent rejoindre votre équipe</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              disabled={!teamName.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer l'Équipe
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Annuler
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Join Team Modal
interface JoinTeamModalProps {
  onClose: () => void;
}

const JoinTeamModal = ({ onClose }: JoinTeamModalProps) => {
  const [teamCode, setTeamCode] = useState('');

  const handleJoin = () => {
    console.log('Joining team with code:', teamCode);
    // API call will go here
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Rejoindre une Équipe</h2>
          <p className="text-gray-600">Entrez le code d'équipe fourni par votre capitaine</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Code d'Équipe *
            </label>
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              placeholder="ALPHA2025"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all text-center text-2xl font-bold tracking-wider"
              maxLength={10}
            />
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-semibold mb-1">Demandez le code à votre capitaine</p>
                <p className="text-green-700">Le code d'équipe est unique et permet de rejoindre l'équipe instantanément</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={!teamCode.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rejoindre l'Équipe
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Annuler
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
