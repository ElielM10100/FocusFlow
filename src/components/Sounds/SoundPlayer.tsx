// ============================================
// PLAYER DE SONS AMBIENTE
// ============================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { useApp } from '../../context/AppContext';
import { AMBIENT_SOUNDS } from '../../utils/constants';

const SoundPlayer: React.FC = () => {
  const { state, setSelectedSound, setIsPlaying } = useApp();
  const { isPlaying, currentSound, volume, playSound, pauseSound, changeVolume } = useAudio();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleSoundSelect = async (soundId: string) => {
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    try {
      await playSound(sound.audioSrc);
      setSelectedSound(soundId);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
    }
  };

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      pauseSound();
      setIsPlaying(false);
    } else if (currentSound && state.selectedSound) {
      const sound = AMBIENT_SOUNDS.find(s => s.id === state.selectedSound);
      if (sound) {
        playSound(sound.audioSrc);
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    changeVolume(newVolume / 100);
  };

  // Agrupar sons por categoria
  const soundsByCategory = AMBIENT_SOUNDS.reduce((acc, sound) => {
    if (!acc[sound.category]) {
      acc[sound.category] = [];
    }
    acc[sound.category].push(sound);
    return acc;
  }, {} as Record<string, typeof AMBIENT_SOUNDS>);

  const categoryLabels = {
    nature: '🌿 Natureza',
    rain: '🌧️ Chuva',
    ambient: '🏠 Ambiente',
    instrumental: '🎵 Instrumental'
  };

  return (
    <div className="sound-player bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Volume2 size={20} />
          Sons Ambiente
        </h3>
        
        {/* Controles principais */}
        <div className="flex items-center gap-2">
          {state.selectedSound && (
            <motion.button
              onClick={handleTogglePlayPause}
              className={`btn btn-icon ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>
          )}

          {/* Controle de Volume */}
          <div className="relative">
            <motion.button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="btn btn-secondary btn-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </motion.button>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-4 min-w-[120px] z-10"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Player atual */}
      {state.selectedSound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {AMBIENT_SOUNDS.find(s => s.id === state.selectedSound)?.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {AMBIENT_SOUNDS.find(s => s.id === state.selectedSound)?.name}
              </div>
              <div className="text-sm text-gray-600">
                {isPlaying ? '▶️ Reproduzindo...' : '⏸️ Pausado'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-400'}`}
                animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="text-xs text-gray-500">
                {isPlaying ? 'AO VIVO' : 'PAUSADO'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de sons por categoria */}
      <div className="space-y-6">
        {Object.entries(soundsByCategory).map(([category, sounds]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h4>
            <div className="sound-grid">
              {sounds.map((sound) => (
                <motion.button
                  key={sound.id}
                  onClick={() => handleSoundSelect(sound.id)}
                  className={`sound-item ${
                    state.selectedSound === sound.id ? 'active' : ''
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className="sound-icon">{sound.icon}</span>
                  <span className="text-sm font-medium">{sound.name}</span>
                  
                  {state.selectedSound === sound.id && isPlaying && (
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dicas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h5 className="text-sm font-semibold text-gray-700 mb-2">💡 Dicas:</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Sons ambiente ajudam a manter o foco durante sessões Pomodoro</li>
          <li>• Experimente diferentes sons para encontrar o que mais funciona para você</li>
          <li>• O volume pode ser ajustado independentemente do volume do sistema</li>
          <li>• Os sons continuam tocando em loop durante suas sessões</li>
        </ul>
      </motion.div>

      {/* Visualizador de áudio (decorativo) */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-center gap-1"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-500 rounded-full"
              animate={{
                height: [4, 12, 8, 16, 6, 10, 4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SoundPlayer;