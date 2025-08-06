// ============================================
// PREVIEW DAS ESTATÍSTICAS
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Flame } from 'lucide-react';

interface StatsPreviewProps {
  sessions: number;
}

const StatsPreview: React.FC<StatsPreviewProps> = ({ sessions }) => {
  const stats = [
    {
      icon: Clock,
      label: 'Sessões Hoje',
      value: sessions,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      label: 'Produtividade',
      value: '92%',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      label: 'Meta Semanal',
      value: `${sessions}/10`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Flame,
      label: 'Sequência',
      value: '3 dias',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-4 text-center border border-gray-100`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className={`inline-flex p-2 rounded-lg ${stat.bgColor.replace('50', '100')} mb-2`}>
              <Icon className={stat.color} size={20} />
            </div>
            <div className="font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsPreview;