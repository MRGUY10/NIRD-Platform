import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Recycle, Sparkles, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../lib/api-client';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
      <motion.div variants={itemVariants} className="text-center mb-8">
        <Link to="/" className="inline-block mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 to-blue-400/20 blur-xl"
            />
            <Recycle className="w-8 h-8 text-white relative z-10" />
          </motion.div>
        </Link>
        
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">Plateforme NIRD</span>
        </motion.div>
        
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-gray-900 via-green-800 to-blue-900 bg-clip-text text-transparent">
          Bon Retour!
        </h1>
        <p className="text-gray-600 text-lg">Connectez-vous à votre compte NIRD</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-center gap-3 shadow-lg"
        >
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <motion.div variants={itemVariants}>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-600" />
            Adresse Email
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
            <input
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide',
                },
              })}
              type="email"
              id="email"
              className="relative w-full px-4 py-3.5 pl-4 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400 bg-white/50"
              placeholder="votre.email@exemple.com"
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Mail className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants}>
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            Mot de Passe
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity" />
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
              className="relative w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400 bg-white/50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.div>
            </button>
          </div>
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
              Se souvenir de moi
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1 group"
          >
            Mot de passe oublié?
            <Shield className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </Link>
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
                Connexion en cours...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Se Connecter
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
            <span className="px-4 bg-white text-gray-500 font-semibold">Nouveau sur NIRD?</span>
          </div>
        </div>
      </motion.div>

      {/* Register Link */}
      <motion.div variants={itemVariants} className="mt-6">
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-green-500 hover:text-green-700 hover:from-green-50 hover:to-emerald-50 transition-all shadow-lg hover:shadow-xl"
          >
            Créer un Compte
          </motion.button>
        </Link>
      </motion.div>
    </div>
    </motion.div>
  );
};
