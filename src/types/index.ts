// ============================================
// FOCUSFLOW - TYPES E INTERFACES
// ============================================

export interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isPaused: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  cycles: number;
}

export interface SessionData {
  id: string;
  date: string;
  type: 'pomodoro' | 'meditation';
  duration: number;
  completed: boolean;
  mood?: number;
  notes?: string;
}

export interface UserStats {
  totalSessions: number;
  totalFocusTime: number;
  totalMeditationTime: number;
  currentStreak: number;
  longestStreak: number;
  sessionsToday: number;
  avgSessionLength: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface SoundOption {
  id: string;
  name: string;
  icon: string;
  audioSrc: string;
  category: 'nature' | 'ambient' | 'rain' | 'instrumental';
}

export interface MeditationSession {
  id: string;
  duration: number;
  type: 'breathing' | 'mindfulness' | 'body-scan';
  guidedAudio?: string;
  backgroundSound?: string;
}

export interface Insight {
  id: string;
  type: 'productivity' | 'wellness' | 'achievement';
  title: string;
  description: string;
  data?: any;
  date: string;
}

export interface AppSettings {
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  cyclesBeforeLongBreak: number;
  notifications: boolean;
  soundEnabled: boolean;
  backgroundSound: string | null;
  theme: 'light' | 'dark' | 'auto';
  weeklyGoal: number;
}

export interface AppState {
  timer: TimerState;
  sessions: SessionData[];
  stats: UserStats;
  settings: AppSettings;
  selectedSound: string | null;
  isPlaying: boolean;
  currentView: 'timer' | 'meditation' | 'stats' | 'sounds' | 'settings';
}