// ============================================
// HOOK PARA ESTATÍSTICAS E INSIGHTS
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { SessionData, UserStats, Insight } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { 
  startOfWeek, 
  endOfWeek, 
  isWithinInterval, 
  format, 
  parseISO,
  startOfDay,
  endOfDay,
  subDays,
  differenceInDays
} from 'date-fns';

export const useStats = () => {
  const [sessions, setSessions] = useLocalStorage<SessionData[]>('focusflow_sessions', []);
  const [weeklyGoal, setWeeklyGoal] = useLocalStorage<number>('focusflow_weekly_goal', 10);

  // Adicionar nova sessão
  const addSession = (sessionData: Omit<SessionData, 'id' | 'date'>) => {
    const newSession: SessionData = {
      ...sessionData,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString()
    };

    setSessions(prev => [...prev, newSession]);
  };

  // Estatísticas calculadas
  const stats = useMemo((): UserStats => {
    const now = new Date();
    const today = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Segunda-feira
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Sessões de hoje
    const todaySessions = sessions.filter(session => {
      const sessionDate = parseISO(session.date);
      return isWithinInterval(sessionDate, { start: today, end: endOfDay(now) });
    });

    // Sessões da semana
    const weekSessions = sessions.filter(session => {
      const sessionDate = parseISO(session.date);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    });

    // Calcular streak atual
    let currentStreak = 0;
    let checkDate = startOfDay(now);
    
    while (true) {
      const dayStart = startOfDay(checkDate);
      const dayEnd = endOfDay(checkDate);
      
      const hasSessions = sessions.some(session => {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { start: dayStart, end: dayEnd }) && session.completed;
      });

      if (hasSessions) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    // Calcular maior streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = [...new Set(sessions.map(s => format(parseISO(s.date), 'yyyy-MM-dd')))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const daysDiff = differenceInDays(curr, prev);

        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Tempo total de foco e meditação
    const completedSessions = sessions.filter(s => s.completed);
    const totalFocusTime = completedSessions
      .filter(s => s.type === 'pomodoro')
      .reduce((acc, s) => acc + s.duration, 0);
    
    const totalMeditationTime = completedSessions
      .filter(s => s.type === 'meditation')
      .reduce((acc, s) => acc + s.duration, 0);

    // Progresso semanal
    const weeklyProgress = (weekSessions.filter(s => s.completed).length / weeklyGoal) * 100;

    // Duração média das sessões
    const avgSessionLength = completedSessions.length > 0 
      ? completedSessions.reduce((acc, s) => acc + s.duration, 0) / completedSessions.length 
      : 0;

    return {
      totalSessions: completedSessions.length,
      totalFocusTime,
      totalMeditationTime,
      currentStreak,
      longestStreak,
      sessionsToday: todaySessions.filter(s => s.completed).length,
      avgSessionLength: Math.round(avgSessionLength),
      weeklyGoal,
      weeklyProgress: Math.min(100, weeklyProgress)
    };
  }, [sessions, weeklyGoal]);

  // Gerar insights baseados nos dados
  const insights = useMemo((): Insight[] => {
    const insights: Insight[] = [];
    const now = new Date();

    // Insight de produtividade
    if (stats.currentStreak >= 7) {
      insights.push({
        id: 'streak_achievement',
        type: 'achievement',
        title: '🔥 Sequência Incrível!',
        description: `Você manteve uma sequência de ${stats.currentStreak} dias consecutivos!`,
        date: now.toISOString()
      });
    }

    // Insight de meta semanal
    if (stats.weeklyProgress >= 100) {
      insights.push({
        id: 'weekly_goal_achieved',
        type: 'achievement',
        title: '🎯 Meta Semanal Alcançada!',
        description: 'Parabéns! Você completou sua meta semanal de sessões.',
        date: now.toISOString()
      });
    } else if (stats.weeklyProgress >= 75) {
      insights.push({
        id: 'weekly_goal_close',
        type: 'productivity',
        title: '📈 Quase Lá!',
        description: `Você está a ${Math.ceil(stats.weeklyGoal - (stats.weeklyProgress / 100 * stats.weeklyGoal))} sessões de completar sua meta semanal.`,
        date: now.toISOString()
      });
    }

    // Insight de bem-estar
    const meditationRatio = stats.totalMeditationTime / (stats.totalFocusTime + stats.totalMeditationTime);
    if (meditationRatio < 0.2 && stats.totalSessions > 10) {
      insights.push({
        id: 'meditation_suggestion',
        type: 'wellness',
        title: '🧘 Que tal Meditar?',
        description: 'Incluir mais sessões de meditação pode melhorar seu foco e bem-estar.',
        date: now.toISOString()
      });
    }

    // Insight de consistência
    if (stats.sessionsToday === 0 && stats.currentStreak > 0) {
      insights.push({
        id: 'daily_reminder',
        type: 'productivity',
        title: '⏰ Hora de Focar!',
        description: 'Você ainda não fez nenhuma sessão hoje. Que tal começar agora?',
        date: now.toISOString()
      });
    }

    return insights;
  }, [stats]);

  // Dados para gráficos
  const getWeeklyData = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const daySessions = sessions.filter(session => {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { start: dayStart, end: dayEnd }) && session.completed;
      });

      days.push({
        day: format(day, 'EEE'),
        sessions: daySessions.length,
        focusTime: daySessions
          .filter(s => s.type === 'pomodoro')
          .reduce((acc, s) => acc + s.duration, 0),
        meditationTime: daySessions
          .filter(s => s.type === 'meditation')
          .reduce((acc, s) => acc + s.duration, 0)
      });
    }

    return days;
  };

  const getMonthlyData = () => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthSessions = sessions.filter(session => {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { start: month, end: monthEnd }) && session.completed;
      });

      months.push({
        month: format(month, 'MMM'),
        sessions: monthSessions.length,
        focusTime: Math.round(monthSessions
          .filter(s => s.type === 'pomodoro')
          .reduce((acc, s) => acc + s.duration, 0) / 60), // em horas
        meditationTime: Math.round(monthSessions
          .filter(s => s.type === 'meditation')
          .reduce((acc, s) => acc + s.duration, 0) / 60) // em horas
      });
    }

    return months;
  };

  return {
    stats,
    insights,
    sessions,
    addSession,
    setWeeklyGoal,
    getWeeklyData,
    getMonthlyData
  };
};