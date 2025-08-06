// ============================================
// CONTEXT API PARA GERENCIAR ESTADO GLOBAL
// ============================================

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppSettings } from '../types';
import { DEFAULT_TIMER_CONFIG } from '../utils/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Estado inicial
const initialState: AppState = {
  timer: {
    minutes: DEFAULT_TIMER_CONFIG.WORK_DURATION,
    seconds: 0,
    isActive: false,
    isPaused: false,
    mode: 'work',
    cycles: 0
  },
  sessions: [],
  stats: {
    totalSessions: 0,
    totalFocusTime: 0,
    totalMeditationTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessionsToday: 0,
    avgSessionLength: 0,
    weeklyGoal: 10,
    weeklyProgress: 0
  },
  settings: {
    pomodoroLength: DEFAULT_TIMER_CONFIG.WORK_DURATION,
    shortBreakLength: DEFAULT_TIMER_CONFIG.SHORT_BREAK_DURATION,
    longBreakLength: DEFAULT_TIMER_CONFIG.LONG_BREAK_DURATION,
    cyclesBeforeLongBreak: DEFAULT_TIMER_CONFIG.CYCLES_BEFORE_LONG_BREAK,
    notifications: true,
    soundEnabled: true,
    backgroundSound: null,
    theme: 'auto',
    weeklyGoal: 10
  },
  selectedSound: null,
  isPlaying: false,
  currentView: 'timer'
};

// Configurações padrão
const defaultSettings: AppSettings = {
  pomodoroLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  cyclesBeforeLongBreak: 4,
  notifications: true,
  soundEnabled: true,
  backgroundSound: null,
  theme: 'auto',
  weeklyGoal: 10
};

// Tipos de ações
type AppAction =
  | { type: 'SET_TIMER_STATE'; payload: Partial<AppState['timer']> }
  | { type: 'ADD_SESSION'; payload: AppState['sessions'][0] }
  | { type: 'UPDATE_STATS'; payload: Partial<AppState['stats']> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_SELECTED_SOUND'; payload: string | null }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: AppState['currentView'] }
  | { type: 'RESET_TIMER' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_TIMER_STATE':
      return {
        ...state,
        timer: { ...state.timer, ...action.payload }
      };

    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload]
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'SET_SELECTED_SOUND':
      return {
        ...state,
        selectedSound: action.payload
      };

    case 'SET_IS_PLAYING':
      return {
        ...state,
        isPlaying: action.payload
      };

    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timer: {
          minutes: state.settings.pomodoroLength,
          seconds: 0,
          isActive: false,
          isPaused: false,
          mode: 'work',
          cycles: 0
        }
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Actions helpers
  setTimerState: (timerState: Partial<AppState['timer']>) => void;
  addSession: (session: AppState['sessions'][0]) => void;
  updateStats: (stats: Partial<AppState['stats']>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setSelectedSound: (soundId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  resetTimer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [settings, setSettings] = useLocalStorage<AppSettings>('focusflow_settings', defaultSettings);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: settings
    });

    // Aplicar configurações do timer
    dispatch({
      type: 'SET_TIMER_STATE',
      payload: {
        minutes: settings.pomodoroLength,
        seconds: 0
      }
    });
  }, [settings]);

  // Salvar configurações quando mudarem
  useEffect(() => {
    setSettings(state.settings);
  }, [state.settings, setSettings]);

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto: seguir preferência do sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      // Aplicar tema inicial
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Escutar mudanças
      mediaQuery.addEventListener('change', updateTheme);
      
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [state.settings.theme]);

  // Helper functions
  const setTimerState = (timerState: Partial<AppState['timer']>) => {
    dispatch({ type: 'SET_TIMER_STATE', payload: timerState });
  };

  const addSession = (session: AppState['sessions'][0]) => {
    dispatch({ type: 'ADD_SESSION', payload: session });
  };

  const updateStats = (stats: Partial<AppState['stats']>) => {
    dispatch({ type: 'UPDATE_STATS', payload: stats });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const setSelectedSound = (soundId: string | null) => {
    dispatch({ type: 'SET_SELECTED_SOUND', payload: soundId });
  };

  const setIsPlaying = (isPlaying: boolean) => {
    dispatch({ type: 'SET_IS_PLAYING', payload: isPlaying });
  };

  const setCurrentView = (view: AppState['currentView']) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const resetTimer = () => {
    dispatch({ type: 'RESET_TIMER' });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setTimerState,
    addSession,
    updateStats,
    updateSettings,
    setSelectedSound,
    setIsPlaying,
    setCurrentView,
    resetTimer
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};