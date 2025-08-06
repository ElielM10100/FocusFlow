// ============================================
// HOOK PARA GERENCIAR ÁUDIO AMBIENTE
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { SoundOption } from '../types';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Limpar áudio ao desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Tocar som
  const playSound = useCallback(async (soundSrc: string) => {
    try {
      // Se já está tocando o mesmo som, pausar
      if (audioRef.current && currentSound === soundSrc && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      // Parar áudio atual se existir
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Criar novo áudio
      const audio = new Audio(soundSrc);
      audio.loop = true;
      audio.volume = volume;
      
      // Eventos do áudio
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', (e) => {
        console.error('Erro ao reproduzir áudio:', e);
        setIsPlaying(false);
      });

      audioRef.current = audio;
      await audio.play();
      
      setCurrentSound(soundSrc);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao tocar som:', error);
      setIsPlaying(false);
    }
  }, [currentSound, isPlaying, volume]);

  // Pausar som
  const pauseSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Parar som
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Alterar volume
  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseSound();
    } else if (audioRef.current && currentSound) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying, pauseSound, currentSound]);

  return {
    isPlaying,
    currentSound,
    volume,
    playSound,
    pauseSound,
    stopSound,
    changeVolume,
    togglePlayPause
  };
};