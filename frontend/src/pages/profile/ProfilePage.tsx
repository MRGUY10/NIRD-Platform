import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, ShieldCheck, School, Loader, AlertCircle, Edit2, Save, X, Lock } from 'lucide-react';
import { authService } from '../../services/authService';
import type { User } from '../../types';
import { getErrorMessage } from '../../lib/api-client';
import { useAuthStore } from '../../store/authStore';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export const ProfilePage = () => {
  const { setUser: setAuthUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const me = await authService.getMe();
        setUser(me);
        setFullName(me.full_name || '');
        setEmail(me.email);
        setAvatarUrl(me.avatar_url || '');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const updated = await authService.updateProfile({
        full_name: fullName || undefined,
        email: email || undefined,
        avatar_url: avatarUrl || undefined,
      });
      setUser(updated);
      setAuthUser(updated);
      setEditing(false);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email);
      setAvatarUrl(user.avatar_url || '');
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{user.full_name || user.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Avatar URL</label>
            {editing ? (
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{user.avatar_url || 'Non défini'}</p>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">Rôle</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 capitalize">{user.role}</p>
          </div>

          {user.school && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <School className="w-5 h-5 text-gray-500" />
                <p className="text-sm font-semibold text-gray-700">École</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{user.school.name}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Compte créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sécurité</h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          <Lock className="w-4 h-4" />
          Changer le mot de passe
        </button>
      </motion.div>

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </motion.div>
  );
};

interface PasswordChangeModalProps {
  onClose: () => void;
}

const PasswordChangeModal = ({ onClose }: PasswordChangeModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 8) {
      alert('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setSubmitting(true);
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      alert('Mot de passe changé avec succès');
      onClose();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : 'Changer'}
            </button>
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
