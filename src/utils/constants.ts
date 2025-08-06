// ============================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================

import { SoundOption } from '../types';

// Configurações padrão do timer
export const DEFAULT_TIMER_CONFIG = {
  WORK_DURATION: 25,
  SHORT_BREAK_DURATION: 5,
  LONG_BREAK_DURATION: 15,
  CYCLES_BEFORE_LONG_BREAK: 4
};

// Sons ambiente disponíveis
export const AMBIENT_SOUNDS: SoundOption[] = [
  {
    id: 'rain',
    name: 'Chuva',
    icon: '🌧️',
    audioSrc: '/sounds/rain.mp3',
    category: 'rain'
  },
  {
    id: 'forest',
    name: 'Floresta',
    icon: '🌲',
    audioSrc: '/sounds/forest.mp3',
    category: 'nature'
  },
  {
    id: 'ocean',
    name: 'Oceano',
    icon: '🌊',
    audioSrc: '/sounds/ocean.mp3',
    category: 'nature'
  },
  {
    id: 'fire',
    name: 'Lareira',
    icon: '🔥',
    audioSrc: '/sounds/fire.mp3',
    category: 'ambient'
  },
  {
    id: 'coffee',
    name: 'Café',
    icon: '☕',
    audioSrc: '/sounds/coffee-shop.mp3',
    category: 'ambient'
  },
  {
    id: 'birds',
    name: 'Pássaros',
    icon: '🐦',
    audioSrc: '/sounds/birds.mp3',
    category: 'nature'
  },
  {
    id: 'wind',
    name: 'Vento',
    icon: '💨',
    audioSrc: '/sounds/wind.mp3',
    category: 'nature'
  },
  {
    id: 'piano',
    name: 'Piano',
    icon: '🎹',
    audioSrc: '/sounds/piano.mp3',
    category: 'instrumental'
  }
];

// Durações de meditação disponíveis
export const MEDITATION_DURATIONS = [
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 15, label: '15 min' },
  { minutes: 20, label: '20 min' },
  { minutes: 30, label: '30 min' }
];

// Tipos de meditação
export const MEDITATION_TYPES = [
  {
    id: 'breathing',
    name: 'Respiração',
    icon: '🫁',
    description: 'Foque na sua respiração para relaxar'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: '🧘',
    description: 'Esteja presente no momento atual'
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    icon: '🎯',
    description: 'Relaxe cada parte do seu corpo'
  }
];

// Mensagens motivacionais
export const MOTIVATIONAL_MESSAGES = {
  work: [
    'Hora de focar! 💪',
    'Vamos produzir! 🚀',
    'Foco total agora! ⚡',
    'Você consegue! 🎯',
    'Mãos à obra! 🔥'
  ],
  shortBreak: [
    'Pausa merecida! ☕',
    'Respire fundo! 🌿',
    'Relaxe um pouco! 😌',
    'Estique-se! 🤸',
    'Hidrate-se! 💧'
  ],
  longBreak: [
    'Pausa longa! 🎉',
    'Tempo de recarregar! 🔋',
    'Você está indo bem! ⭐',
    'Mereceu esse descanso! 😴',
    'Continue assim! 🌟'
  ]
};

// Cores dos modos
export const MODE_COLORS = {
  work: {
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  shortBreak: {
    primary: '#4facfe',
    secondary: '#00f2fe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  longBreak: {
    primary: '#43e97b',
    secondary: '#38f9d7',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
};

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  WORK_COMPLETE: {
    title: '🎉 Sessão de Foco Completa!',
    body: 'Parabéns! Hora de fazer uma pausa.',
    icon: '/favicon.ico'
  },
  BREAK_COMPLETE: {
    title: '⏰ Pausa Terminada!',
    body: 'Vamos voltar ao trabalho?',
    icon: '/favicon.ico'
  }
};

// Metas e achievement
export const ACHIEVEMENT_THRESHOLDS = {
  FIRST_SESSION: 1,
  DAILY_GOAL: 4,
  WEEKLY_STREAK: 7,
  MONTHLY_STREAK: 30,
  TOTAL_HOURS: [1, 5, 10, 25, 50, 100],
  MEDITATION_HOURS: [1, 3, 5, 10, 20]
};

// Configurações da API (para futuras integrações)
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    SESSIONS: '/api/sessions',
    STATS: '/api/stats',
    USER: '/api/user'
  }
};

// Teclas de atalho
export const KEYBOARD_SHORTCUTS = {
  SPACE: 'Space',
  ENTER: 'Enter',
  ESC: 'Escape',
  R: 'KeyR',
  S: 'KeyS',
  M: 'KeyM'
};

// Configurações de chart
export const CHART_COLORS = {
  primary: '#667eea',
  secondary: '#4facfe',
  success: '#43e97b',
  warning: '#f093fb',
  background: '#f8fafc',
  text: '#374151'
};