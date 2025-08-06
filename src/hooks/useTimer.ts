// ============================================
// HOOK PERSONALIZADO PARA TIMER POMODORO
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface UseTimerProps {
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
  cyclesBeforeLongBreak?: number;
  onComplete?: (type: 'work' | 'shortBreak' | 'longBreak') => void;
  onTick?: (minutes: number, seconds: number) => void;
}

export const useTimer = ({
  workDuration = 25,
  shortBreakDuration = 5,
  longBreakDuration = 15,
  cyclesBeforeLongBreak = 4,
  onComplete,
  onTick
}: UseTimerProps = {}) => {
  const [timerState, setTimerState] = useLocalStorage<TimerState>('focusflow_timer', {
    minutes: workDuration,
    seconds: 0,
    isActive: false,
    isPaused: false,
    mode: 'work',
    cycles: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar áudio de notificação
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.7;
  }, []);

  // Função para tocar som de notificação
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  }, []);

  // Função para obter a duração do modo atual
  const getCurrentDuration = useCallback((mode: 'work' | 'shortBreak' | 'longBreak') => {
    switch (mode) {
      case 'work':
        return workDuration;
      case 'shortBreak':
        return shortBreakDuration;
      case 'longBreak':
        return longBreakDuration;
      default:
        return workDuration;
    }
  }, [workDuration, shortBreakDuration, longBreakDuration]);

  // Função para determinar o próximo modo
  const getNextMode = useCallback((currentMode: 'work' | 'shortBreak' | 'longBreak', cycles: number) => {
    if (currentMode === 'work') {
      return cycles % cyclesBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  }, [cyclesBeforeLongBreak]);

  // Função para completar um ciclo
  const completeCurrentCycle = useCallback(() => {
    setTimerState(prev => {
      const newCycles = prev.mode === 'work' ? prev.cycles + 1 : prev.cycles;
      const nextMode = getNextMode(prev.mode, newCycles);
      const nextDuration = getCurrentDuration(nextMode);

      playNotificationSound();
      onComplete?.(prev.mode);

      return {
        ...prev,
        minutes: nextDuration,
        seconds: 0,
        isActive: false,
        isPaused: false,
        mode: nextMode,
        cycles: newCycles
      };
    });
  }, [getNextMode, getCurrentDuration, onComplete, playNotificationSound]);

  // Timer principal
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          const newSeconds = prev.seconds - 1;
          let newMinutes = prev.minutes;

          if (newSeconds < 0) {
            if (prev.minutes === 0) {
              // Timer completado
              completeCurrentCycle();
              return prev;
            }
            newMinutes = prev.minutes - 1;
            return { ...prev, minutes: newMinutes, seconds: 59 };
          }

          const updatedState = { ...prev, seconds: newSeconds };
          onTick?.(newMinutes, newSeconds);
          return updatedState;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isActive, timerState.isPaused, completeCurrentCycle, onTick]);

  // Funções de controle
  const start = useCallback(() => {
    setTimerState(prev => ({ ...prev, isActive: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    setTimerState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setTimerState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const stop = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      minutes: getCurrentDuration(prev.mode),
      seconds: 0
    }));
  }, [getCurrentDuration]);

  const reset = useCallback(() => {
    setTimerState({
      minutes: workDuration,
      seconds: 0,
      isActive: false,
      isPaused: false,
      mode: 'work',
      cycles: 0
    });
  }, [workDuration]);

  const switchMode = useCallback((mode: 'work' | 'shortBreak' | 'longBreak') => {
    const duration = getCurrentDuration(mode);
    setTimerState(prev => ({
      ...prev,
      mode,
      minutes: duration,
      seconds: 0,
      isActive: false,
      isPaused: false
    }));
  }, [getCurrentDuration]);

  // Formatadores
  const formatTime = useCallback((minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback(() => {
    const totalDuration = getCurrentDuration(timerState.mode) * 60;
    const currentTime = timerState.minutes * 60 + timerState.seconds;
    return ((totalDuration - currentTime) / totalDuration) * 100;
  }, [timerState, getCurrentDuration]);

  const getTimeRemaining = useCallback(() => {
    return timerState.minutes * 60 + timerState.seconds;
  }, [timerState.minutes, timerState.seconds]);

  return {
    // Estado
    timerState,
    formattedTime: formatTime(timerState.minutes, timerState.seconds),
    progress: getProgress(),
    timeRemaining: getTimeRemaining(),
    
    // Controles
    start,
    pause,
    resume,
    stop,
    reset,
    switchMode,
    
    // Utilitários
    formatTime,
    getCurrentDuration
  };
};