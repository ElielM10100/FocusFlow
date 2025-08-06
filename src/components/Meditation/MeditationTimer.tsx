// ============================================
// COMPONENTE DE MEDITAÇÃO
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { useApp } from '../../context/AppContext';
import { MEDITATION_DURATIONS, MEDITATION_TYPES } from '../../utils/constants';

interface MeditationTimerProps {
  onComplete?: () => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ onComplete }) => {
  const { addSession } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedType, setSelectedType] = useState('breathing');
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');

  const {
    timerState,
    formattedTime,
    progress,
    start,
    pause,
    resume,
    stop,
    reset
  } = useTimer({
    workDuration: selectedDuration,
    onComplete: handleMeditationComplete,
    onTick: handleMeditationTick
  });

  // Controlar respiração guiada
  useEffect(() => {
    if (timerState.isActive && selectedType === 'breathing') {
      const breathingCycle = setInterval(() => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'pause';
            case 'pause': return 'inhale';
            default: return 'inhale';
          }
        });
      }, 4000); // 4 segundos por fase

      return () => clearInterval(breathingCycle);
    }
  }, [timerState.isActive, selectedType]);

  function handleMeditationComplete() {
    // Adicionar sessão de meditação
    addSession({
      id: `meditation_${Date.now()}`,
      date: new Date().toISOString(),
      type: 'meditation',
      duration: selectedDuration,
      completed: true
    });

    onComplete?.();
  }

  function handleMeditationTick(minutes: number, seconds: number) {
    // Atualizar título da página durante meditação
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `🧘 ${timeString} - Meditação`;
  }

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

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Inspire profundamente...';
      case 'hold': return 'Segure a respiração...';
      case 'exhale': return 'Expire lentamente...';
      case 'pause': return 'Pausa...';
      default: return 'Respire naturalmente...';
    }
  };

  const getBreathingCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 1.2;
      case 'hold': return 1.2;
      case 'exhale': return 0.8;
      case 'pause': return 0.8;
      default: return 1;
    }
  };

  return (
    <div className="meditation-controls">
      {/* Seleção de Duração */}
      {!timerState.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Duração da Meditação
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {MEDITATION_DURATIONS.map((duration) => (
              <button
                key={duration.minutes}
                onClick={() => setSelectedDuration(duration.minutes)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  selectedDuration === duration.minutes
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>

          {/* Tipos de Meditação */}
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Tipo de Meditação
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {MEDITATION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg transition-all text-left ${
                  selectedType === type.id
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm opacity-75">{type.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timer de Meditação */}
      <div className="text-center">
        {selectedType === 'breathing' && timerState.isActive ? (
          // Círculo de respiração
          <div className="relative mb-8">
            <motion.div
              className="breathing-circle mx-auto"
              animate={{ 
                scale: getBreathingCircleScale(),
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-white mb-2">
                  {formattedTime}
                </div>
                <div className="text-lg text-white/80">
                  {getBreathingInstruction()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Timer normal
          <div className="mb-8">
            <motion.div
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-yellow-400 flex items-center justify-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-white mb-2">
                  {formattedTime}
                </div>
                <div className="text-sm text-white/80">
                  {MEDITATION_TYPES.find(t => t.id === selectedType)?.name}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Controles */}
        <div className="flex justify-center gap-4 mb-6">
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

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-white/70 mt-2">
            <span>Início</span>
            <span className="font-medium">{Math.round(progress)}%</span>
            <span>Fim</span>
          </div>
        </div>

        {/* Dicas de Meditação */}
        <AnimatePresence>
          {timerState.isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 text-center"
            >
              <p className="text-white/80 text-sm">
                {selectedType === 'breathing' && 'Siga o ritmo do círculo e respire naturalmente'}
                {selectedType === 'mindfulness' && 'Observe seus pensamentos sem julgá-los'}
                {selectedType === 'body-scan' && 'Relaxe cada parte do seu corpo, começando pelos pés'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeditationTimer;