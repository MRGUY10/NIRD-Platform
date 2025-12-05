import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, School, AlertCircle, Eye, EyeOff, Recycle, Sparkles, Shield, GraduationCap, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../lib/api-client';
import { UserRole } from '../../types';
import type { Variants } from 'framer-motion';

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  role: UserRole;
  school_id?: number;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      role: UserRole.STUDENT,
    },
  });

  const selectedRole = watch('role');
  const password = watch('password');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const levels = [
      { level: 0, label: '', color: '' },
      { level: 1, label: 'Faible', color: 'bg-red-500' },
      { level: 2, label: 'Moyen', color: 'bg-orange-500' },
      { level: 3, label: 'Bon', color: 'bg-yellow-500' },
      { level: 4, label: 'Fort', color: 'bg-green-500' },
      { level: 5, label: 'Excellent', color: 'bg-emerald-500' },
    ];
    return levels[strength] || levels[0];
  }, [password]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Recycle className="w-16 h-16 text-green-600 mx-auto" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 opacity-20 blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Plateforme NIRD</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Créer un Compte
          </h1>
          <p className="mt-3 text-gray-600 text-lg">Rejoignez la plateforme NIRD aujourd'hui</p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-start shadow-lg"
          >
            <AlertCircle className="text-red-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </motion.div>
        )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <motion.div variants={itemVariants}>
          <label htmlFor="username" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-lg">
              <User className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700">Nom d'utilisateur</span>
            </div>
          </label>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"
              whileHover={{ scale: 1.02 }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <User className="h-5 w-5 text-gray-400" />
              </motion.div>
            </div>
            <input
              {...register('username', { 
                required: 'Le nom d\'utilisateur est requis',
                minLength: {
                  value: 3,
                  message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                },
                pattern: {
                  value: /^[a-zA-Z0-9._-]+$/,
                  message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, points, tirets et underscores'
                }
              })}
              type="text"
              id="username"
              className="relative block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
              placeholder="jean.dupont"
            />
          </div>
          {errors.username && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              {errors.username.message}
            </motion.p>
          )}
        </motion.div>

        {/* Full Name */}
        <motion.div variants={itemVariants}>
          <label htmlFor="full_name" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 rounded-lg">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700">Nom Complet</span>
            </div>
          </label>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"
              whileHover={{ scale: 1.02 }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <User className="h-5 w-5 text-gray-400" />
              </motion.div>
            </div>
            <input
              {...register('full_name', { required: 'Le nom complet est requis' })}
              type="text"
              id="full_name"
              className="relative block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
              placeholder="Jean Dupont"
            />
          </div>
          {errors.full_name && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              {errors.full_name.message}
            </motion.p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants}>
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-lg">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Adresse Email</span>
            </div>
          </label>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"
              whileHover={{ scale: 1.02 }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <Mail className="h-5 w-5 text-gray-400" />
              </motion.div>
            </div>
            <input
              {...register('email', {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide',
                },
              })}
              type="email"
              id="email"
              className="relative block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
              placeholder="vous@exemple.com"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Role Selection */}
        <motion.div variants={itemVariants}>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Je suis un(e)...</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.label
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center p-5 border-2 rounded-xl cursor-pointer transition-all shadow-lg ${
                selectedRole === UserRole.STUDENT
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-green-200'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <input
                {...register('role')}
                type="radio"
                value={UserRole.STUDENT}
                className="sr-only"
              />
              <GraduationCap className={`w-10 h-10 mb-2 ${selectedRole === UserRole.STUDENT ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-base font-bold ${selectedRole === UserRole.STUDENT ? 'text-green-700' : 'text-gray-700'}`}>
                Étudiant(e)
              </span>
              {selectedRole === UserRole.STUDENT && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
              )}
            </motion.label>
            <motion.label
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center p-5 border-2 rounded-xl cursor-pointer transition-all shadow-lg ${
                selectedRole === UserRole.TEACHER
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-blue-200'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <input
                {...register('role')}
                type="radio"
                value={UserRole.TEACHER}
                className="sr-only"
              />
              <BookOpen className={`w-10 h-10 mb-2 ${selectedRole === UserRole.TEACHER ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-base font-bold ${selectedRole === UserRole.TEACHER ? 'text-blue-700' : 'text-gray-700'}`}>
                Enseignant(e)
              </span>
              {selectedRole === UserRole.TEACHER && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
              )}
            </motion.label>
          </div>
        </motion.div>

        {/* School Name (conditional) */}
        {selectedRole === UserRole.TEACHER && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label htmlFor="school_name" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 rounded-lg">
                <School className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-700">Nom de l'École</span>
              </div>
            </label>
            <div className="relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"
                whileHover={{ scale: 1.02 }}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <School className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
              <input
                {...register('school_id', {
                  required: selectedRole === UserRole.TEACHER ? "Le nom de l'école est requis" : false,
                })}
                type="text"
                id="school_id"
                className="relative block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                placeholder="Nom de votre école"
              />
            </div>
            {errors.school_id && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                {errors.school_id.message}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Password */}
        <motion.div variants={itemVariants}>
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
              <Lock className="w-4 h-4 text-red-600" />
              <span className="text-red-700">Mot de Passe</span>
            </div>
          </label>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"
              whileHover={{ scale: 1.02 }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <Lock className="h-5 w-5 text-gray-400" />
              </motion.div>
            </div>
            <input
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="relative block w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/30 focus:border-red-500 transition-all text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {password && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${passwordStrength.color} transition-all`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                  {passwordStrength.label}
                </span>
              </div>
            </motion.div>
          )}
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={itemVariants}>
          <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-lg">
              <Shield className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700">Confirmer le Mot de Passe</span>
            </div>
          </label>
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"
              whileHover={{ scale: 1.02 }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <Shield className="h-5 w-5 text-gray-400" />
              </motion.div>
            </div>
            <input
              {...register('confirmPassword', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="relative block w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div variants={itemVariants} className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="terms" className="ml-3 block text-sm text-gray-600">
            J'accepte les{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-700 font-semibold underline">
              Conditions d'Utilisation
            </Link>{' '}
            et la{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-700 font-semibold underline">
              Politique de Confidentialité
            </Link>
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="flex items-center justify-center gap-2 relative z-10">
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
                Création du compte...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Créer mon Compte
              </>
            )}
          </span>
        </motion.button>
      </form>

      {/* Divider */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-semibold">Déjà un compte?</span>
          </div>
        </div>
      </motion.div>

      {/* Login Link */}
      <motion.div variants={itemVariants} className="mt-6">
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-green-500 hover:text-green-700 hover:from-green-50 hover:to-emerald-50 transition-all shadow-lg hover:shadow-xl"
          >
            Se Connecter
          </motion.button>
        </Link>
      </motion.div>
    </div>
    </motion.div>
  );
};
