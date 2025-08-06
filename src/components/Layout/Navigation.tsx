// ============================================
// COMPONENTE DE NAVEGAÇÃO
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Brain, BarChart3, Volume2, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navigation: React.FC = () => {
  const { state, setCurrentView } = useApp();

  const navItems = [
    { id: 'timer', label: 'Timer', icon: Timer, emoji: '⏰' },
    { id: 'meditation', label: 'Meditação', icon: Brain, emoji: '🧘' },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3, emoji: '📊' },
    { id: 'sounds', label: 'Sons', icon: Volume2, emoji: '🎵' }
  ] as const;

  return (
    <nav className="nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = state.currentView === item.id;
        
        return (
          <motion.button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.emoji}</span>
              <Icon size={18} />
              <span className="hidden md:inline">{item.label}</span>
            </div>
            
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                layoutId="activeTab"
                initial={false}
                style={{ transform: 'translateX(-50%)' }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};

export default Navigation;