import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'red';
}

const colorVariants = {
  green: {
    bg: 'from-green-500 to-emerald-500',
    light: 'from-green-50 to-emerald-50',
    text: 'text-green-600',
    icon: 'text-green-600',
  },
  blue: {
    bg: 'from-blue-500 to-cyan-500',
    light: 'from-blue-50 to-cyan-50',
    text: 'text-blue-600',
    icon: 'text-blue-600',
  },
  purple: {
    bg: 'from-purple-500 to-pink-500',
    light: 'from-purple-50 to-pink-50',
    text: 'text-purple-600',
    icon: 'text-purple-600',
  },
  orange: {
    bg: 'from-orange-500 to-amber-500',
    light: 'from-orange-50 to-amber-50',
    text: 'text-orange-600',
    icon: 'text-orange-600',
  },
  pink: {
    bg: 'from-pink-500 to-rose-500',
    light: 'from-pink-50 to-rose-50',
    text: 'text-pink-600',
    icon: 'text-pink-600',
  },
  red: {
    bg: 'from-red-500 to-pink-500',
    light: 'from-red-50 to-pink-50',
    text: 'text-red-600',
    icon: 'text-red-600',
  },
};

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  trend,
  color = 'green' 
}: StatCardProps) => {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.light} opacity-50 group-hover:opacity-70 transition-opacity`} />
      
      {/* Icon Background Circle */}
      <div className="absolute -top-6 -right-6 w-32 h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`w-full h-full rounded-full bg-gradient-to-br ${colors.bg} opacity-10`}
        />
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                trend.isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </motion.div>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
          {title}
        </h3>
        
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-4xl font-extrabold ${colors.text} mb-1`}
        >
          {value}
        </motion.p>

        {subtitle && (
          <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
        )}

        {/* Decorative Bottom Border */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.bg}`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};
