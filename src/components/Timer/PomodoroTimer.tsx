// ============================================
// COMPONENTE PRINCIPAL DO TIMER POMODORO
// ============================================

import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { useApp } from '../../context/AppContext';
import { MOTIVATIONAL_MESSAGES, MODE_COLORS } from '../../utils/constants';
import { formatDuration, showNotification, requestNotificationPermission } from '../../utils/helpers';

const PomodoroTimer: React.FC = () => {
  const { state, addSession, updateStats } = useApp();
  const { settings } = state;

  const {
    timerState,
    formattedTime,
    progress,
    start,
    pause,
    resume,
    stop,
    reset,
    switchMode
  } = useTimer({
    workDuration: settings.pomodoroLength,
    shortBreakDuration: settings.shortBreakLength,
    longBreakDuration: settings.longBreakLength,
    cyclesBeforeLongBreak: settings.cyclesBeforeLongBreak,
    onComplete: handleTimerComplete,
    onTick: handleTimerTick
  });

  // Solicitar permissão para notificações
  useEffect(() => {
    if (settings.notifications) {
      requestNotificationPermission();
    }
  }, [settings.notifications]);

  // Callback quando o timer completa
  function handleTimerComplete(type: 'work' | 'shortBreak' | 'longBreak') {
    // Adicionar sessão
    if (type === 'work') {
      addSession({
        id: `session_${Date.now()}`,
        date: new Date().toISOString(),
        type: 'pomodoro',
        duration: settings.pomodoroLength,
        completed: true
      });
    }

    // Mostrar notificação
    if (settings.notifications) {
      const messages = MOTIVATIONAL_MESSAGES[type] || [];
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      showNotification('FocusFlow', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }

  // Callback a cada tick do timer
  function handleTimerTick(minutes: number, seconds: number) {
    // Atualizar título da página
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - FocusFlow`;
  }

  // Handlers dos botões
  const handleStart = useCallback(() => {
    if (timerState.isPaused) {
      resume();
    } else {
      start();
    }
  }, [timerState.isPaused, resume, start]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleStop = useCallback(() => {
    stop();
    document.title = 'FocusFlow';
  }, [stop]);

  const handleReset = useCallback(() => {
    reset();
    document.title = 'FocusFlow';
  }, [reset]);

  // Obter cor do modo atual
  const currentModeColor = MODE_COLORS[timerState.mode];

  // Obter mensagem motivacional
  const getMotivationalMessage = () => {
    const messages = MOTIVATIONAL_MESSAGES[timerState.mode] || [];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="pomodoro-container">
      {/* Seletor de Modo */}
      <div className="mode-selector mb-6">
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
          {(['work', 'shortBreak', 'longBreak'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                timerState.mode === mode
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {mode === 'work' && '🎯 Foco'}
              {mode === 'shortBreak' && '☕ Pausa'}
              {mode === 'longBreak' && '🌟 Descanso'}
            </button>
          ))}
        </div>
      </div>

      {/* Timer Principal */}
      <motion.div
        className="timer-circle"
        style={{
          background: currentModeColor.gradient,
          boxShadow: `0 0 50px ${currentModeColor.primary}40`
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        {/* Círculo de Progresso */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 130}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 130 * (1 - progress / 100)
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Display do Tempo */}
        <div className="timer-display relative z-10">
          <motion.div
            key={formattedTime}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formattedTime}
          </motion.div>
        </div>

        {/* Indicador de Ciclos */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
          Ciclo {timerState.cycles + 1}
        </div>
      </motion.div>

      {/* Controles */}
      <div className="timer-controls">
        <AnimatePresence mode="wait">
          {!timerState.isActive ? (
            <motion.button
              key="start"
              onClick={handleStart}
              className="btn btn-primary btn-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={24} />
            </motion.button>
          ) : timerState.isPaused ? (
            <motion.button
              key="resume"
              onClick={handleStart}
              className="btn btn-success btn-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={24} />
            </motion.button>
          ) : (
            <motion.button
              key="pause"
              onClick={handlePause}
              className="btn btn-secondary btn-icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleStop}
          className="btn btn-secondary btn-icon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!timerState.isActive && !timerState.isPaused}
        >
          <Square size={24} />
        </motion.button>

        <motion.button
          onClick={handleReset}
          className="btn btn-secondary btn-icon"
          whileHover={{ scale: 1.05, rotate: 360 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw size={24} />
        </motion.button>
      </div>

      {/* Mensagem Motivacional */}
      <AnimatePresence>
        {timerState.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-center"
          >
            <p className="text-lg font-medium text-gray-700">
              {getMotivationalMessage()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {timerState.mode === 'work' && 'Mantenha o foco! 💪'}
              {timerState.mode === 'shortBreak' && 'Aproveite a pausa! ☕'}
              {timerState.mode === 'longBreak' && 'Relaxe e recarregue! 🌟'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="mt-8 w-full">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              background: currentModeColor.gradient
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>0%</span>
          <span className="font-medium">{Math.round(progress)}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;