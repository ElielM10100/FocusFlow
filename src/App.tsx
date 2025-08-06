// ============================================
// FOCUSFLOW - EXCELÊNCIA REDESIGN
// App Ultra Premium de Produtividade
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Timer, 
  Brain, 
  BarChart3, 
  Volume2, 
  TrendingUp, 
  Clock, 
  Target, 
  Flame,
  Sparkles
} from 'lucide-react';
import './App.css';

// Hook personalizado para Timer Pomodoro
function useTimer(initialMinutes = 25) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            if (minutes === 0) {
              // Timer completo
              setIsActive(false);
              setIsPaused(false);
              setSessions(prev => prev + 1);
              
              // Notificação premium
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('🎉 Sessão Completa!', {
                  body: 'Parabéns! Você concluiu mais uma sessão de foco!',
                  icon: '/favicon.ico'
                });
              }
              
              // Reset para próxima sessão
              setMinutes(initialMinutes);
              return 0;
            }
            setMinutes(m => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, minutes, initialMinutes]);

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  const formatTime = (m: number, s: number) => 
    `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  const progress = ((initialMinutes * 60 - (minutes * 60 + seconds)) / (initialMinutes * 60)) * 100;

  return {
    minutes,
    seconds,
    isActive,
    isPaused,
    sessions,
    start,
    pause,
    resume,
    reset,
    formatTime,
    progress
  };
}

// Componente Preview das Estatísticas Ultra Premium
const StatsPreview: React.FC<{ sessions: number }> = ({ sessions }) => {
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
      value: sessions > 0 ? '95%' : '0%',
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
      value: sessions > 2 ? `${sessions} dias` : 'Iniciando',
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

// Componente Timer Principal Ultra Premium
const PomodoroTimer: React.FC = () => {
  const [duration, setDuration] = useState(25);
  const timer = useTimer(duration);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getStatusMessage = () => {
    if (timer.isActive && !timer.isPaused) {
      const messages = [
        '🎯 Foco total! Você está dominando!',
        '🚀 Energia máxima! Continue assim!',
        '💪 Produtividade em alta! Arrasando!',
        '⚡ Zona de foco ativada! Imparável!'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    if (timer.isPaused) {
      return '⏸️ Pausa estratégica. Respire e volte mais forte!';
    }
    return '🌟 Pronto para transformar ideias em resultados?';
  };

  const getModeColor = () => {
    if (timer.isActive && !timer.isPaused) return 'var(--gradient-primary)';
    if (timer.isPaused) return 'var(--gradient-warning)';
    return 'var(--gradient-secondary)';
  };

  return (
    <div className={`pomodoro-container ${timer.isActive && !timer.isPaused ? 'timer-running' : ''}`}>
      {/* Header do Timer */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-300" size={32} />
          Timer Pomodoro
          <Sparkles className="text-yellow-300" size={32} />
        </h1>
        <p className="text-white/80">Maximize seu foco com técnicas cientificamente comprovadas</p>
      </motion.div>

      {/* Timer Circle Ultra Premium */}
      <motion.div
        className="timer-circle"
        style={{ background: getModeColor() }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Progress Ring SVG */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 130}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 130 * (1 - timer.progress / 100)
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Display do Tempo Ultra Premium */}
        <motion.div
          className="timer-display"
          key={timer.formatTime(timer.minutes, timer.seconds)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        >
          {timer.formatTime(timer.minutes, timer.seconds)}
        </motion.div>

        {/* Indicador de Sessões Melhorado */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
           {timer.sessions} 
        </motion.div>
      </motion.div>

      {/* Controles Ultra Premium */}
      <motion.div
        className="timer-controls"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {!timer.isActive ? (
            <motion.button
              key="start"
              onClick={timer.start}
              className="btn btn-primary"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Iniciar Foco
            </motion.button>
          ) : timer.isPaused ? (
            <motion.button
              key="resume"
              onClick={timer.resume}
              className="btn btn-success"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Continuar
            </motion.button>
          ) : (
            <motion.button
              key="pause"
              onClick={timer.pause}
              className="btn btn-warning"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={20} />
              Pausar
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={timer.reset}
          className="btn btn-secondary"
          whileHover={{ scale: 1.05, rotate: 360 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw size={20} />
          Reiniciar
        </motion.button>
      </motion.div>

      {/* Progress Bar Ultra Premium */}
      <motion.div
        className="progress-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${timer.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="progress-text">
          <span>Início</span>
          <motion.span 
            className="font-bold"
            key={Math.round(timer.progress)}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(timer.progress)}%
          </motion.span>
          <span>Meta</span>
        </div>
      </motion.div>

      {/* Status Message Premium */}
      <motion.div
        className="status-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        key={timer.isActive ? 'active' : timer.isPaused ? 'paused' : 'idle'}
      >
        {getStatusMessage()}
      </motion.div>

      {/* Configuração Rápida Premium */}
      <motion.div
        className="mt-6 flex gap-3 justify-center flex-wrap"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {[
          { time: 15, label: '15min', emoji: '⚡' },
          { time: 25, label: '25min', emoji: '🎯' },
          { time: 45, label: '45min', emoji: '🚀' }
        ].map((option) => (
          <motion.button
            key={option.time}
            onClick={() => setDuration(option.time)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md border ${
              duration === option.time
                ? 'bg-white/20 text-white border-white/40 shadow-lg'
                : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15 hover:border-white/30'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{option.emoji}</span>
            {option.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Preview das Estatísticas */}
      <StatsPreview sessions={timer.sessions} />
    </div>
  );
};

// Componente de Seção Coming Soon
const ComingSoonSection: React.FC<{ 
  icon: string; 
  title: string; 
  description: string;
  animation?: object;
}> = ({ icon, title, description, animation }) => (
  <motion.div
    className="text-center py-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    <motion.div
      className="text-8xl mb-6"
      {...animation}
    >
      {icon}
    </motion.div>
    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
    <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
      {description}
    </p>
    <motion.div
      className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Sparkles className="text-yellow-300" size={18} />
      <span className="text-white/80 font-medium">Em desenvolvimento</span>
    </motion.div>
  </motion.div>
);

// Componente Principal da App
function App() {
  const [currentView, setCurrentView] = useState('timer');

  const navItems = [
    { id: 'timer', label: 'Timer', icon: Timer, emoji: '⏰' },
    { id: 'meditation', label: 'Meditação', icon: Brain, emoji: '🧘' },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3, emoji: '📊' },
    { id: 'sounds', label: 'Sons', icon: Volume2, emoji: '🎵' }
  ];

  return (
    <div className="app">
      {/* Background Elements */}
      <div className="floating-1"></div>
      <div className="floating-2"></div>

      {/* Header Ultra Premium */}
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="container">
          <div className="header-content">
            <motion.div
              className="logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              FocusFlow
            </motion.div>

            <nav className="nav">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="mr-2">{item.emoji}</span>
                    <Icon size={16} />
                    <span className="hidden md:inline ml-2">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
          >
            <AnimatePresence mode="wait">
              {currentView === 'timer' && (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}
                >
                  <PomodoroTimer />
                </motion.div>
              )}

              {currentView === 'meditation' && (
                <ComingSoonSection
                  icon="🧘"
                  title="Meditação Guiada"
                  description="Sessões personalizadas de meditação para equilibrar mente e corpo, aumentando seu foco e bem-estar."
                  animation={{
                    animate: { scale: [1, 1.05, 1] },
                    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }}
                />
              )}

              {currentView === 'stats' && (
                <ComingSoonSection
                  icon="📊"
                  title="Análise Inteligente"
                  description="Dashboard completo com insights de produtividade, tendências e recomendações personalizadas com IA."
                  animation={{
                    animate: { rotateY: [0, 360] },
                    transition: { duration: 4, repeat: Infinity, ease: 'linear' }
                  }}
                />
              )}

              {currentView === 'sounds' && (
                <ComingSoonSection
                  icon="🎵"
                  title="Sons Ambiente"
                  description="Biblioteca premium de sons relaxantes e música ambiente para potencializar sua concentração."
                  animation={{
                    animate: { rotate: [0, 15, -15, 0] },
                    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;