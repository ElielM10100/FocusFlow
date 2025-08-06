// ============================================
// COMPONENTE DE CABEÇALHO
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Navigation from './Navigation';

const Header: React.FC = () => {
  const { state, updateSettings } = useApp();

  const toggleTheme = () => {
    const newTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <motion.div
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            FocusFlow
          </motion.div>

          {/* Navegação */}
          <Navigation />

          {/* Controles */}
          <div className="flex items-center gap-3">
            {/* Toggle de Tema */}
            <motion.button
              onClick={toggleTheme}
              className="btn btn-secondary btn-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Alternar tema"
            >
              {state.settings.theme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </motion.button>

            {/* Configurações */}
            <motion.button
              className="btn btn-secondary btn-icon"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              title="Configurações"
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;