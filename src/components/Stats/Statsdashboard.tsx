// ============================================
// DASHBOARD DE ESTATÍSTICAS
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Clock, 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar,
  Brain,
  Award,
  BarChart3
} from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { formatDuration } from '../../utils/helpers';
import { CHART_COLORS } from '../../utils/constants';

const StatsDashboard: React.FC = () => {
  const { stats, insights, getWeeklyData, getMonthlyData } = useStats();

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  // Dados para o gráfico de pizza
  const pieData = [
    { name: 'Foco', value: stats.totalFocusTime, color: CHART_COLORS.primary },
    { name: 'Meditação', value: stats.totalMeditationTime, color: CHART_COLORS.secondary }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="stats-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Estatísticas Principais */}
      <motion.div variants={itemVariants} className="stats-grid mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Clock className="text-blue-500" size={24} />
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="stat-value">{stats.totalSessions}</div>
          <div className="stat-label">Sessões Completas</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Brain className="text-purple-500" size={24} />
            <span className="text-2xl">🧠</span>
          </div>
          <div className="stat-value">{formatDuration(stats.totalFocusTime)}</div>
          <div className="stat-label">Tempo de Foco</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Flame className="text-orange-500" size={24} />
            <span className="text-2xl">🔥</span>
          </div>
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Sequência Atual</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Target className="text-green-500" size={24} />
            <span className="text-2xl">🎯</span>
          </div>
          <div className="stat-value">{Math.round(stats.weeklyProgress)}%</div>
          <div className="stat-label">Meta Semanal</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="text-indigo-500" size={24} />
            <span className="text-2xl">📅</span>
          </div>
          <div className="stat-value">{stats.sessionsToday}</div>
          <div className="stat-label">Sessões Hoje</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <Award className="text-yellow-500" size={24} />
            <span className="text-2xl">🏆</span>
          </div>
          <div className="stat-value">{stats.longestStreak}</div>
          <div className="stat-label">Maior Sequência</div>
        </div>
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-2 gap-6 mb-8">
        {/* Gráfico Semanal */}
        <motion.div variants={itemVariants} className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={20} />
              Atividade Semanal
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="sessions" 
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfico Mensal */}
        <motion.div variants={itemVariants} className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Progresso Mensal
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focusTime" 
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                  name="Foco (horas)"
                />
                <Line 
                  type="monotone" 
                  dataKey="meditationTime" 
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
                  name="Meditação (horas)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Distribuição de Tempo */}
      {(stats.totalFocusTime > 0 || stats.totalMeditationTime > 0) && (
        <motion.div variants={itemVariants} className="card mb-8">
          <div className="card-header">
            <h3 className="card-title">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
              Distribuição de Tempo
            </h3>
          </div>
          <div className="grid grid-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatDuration(value), 'Tempo']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <span className="font-medium">Foco</span>
                <span className="text-gray-500">{formatDuration(stats.totalFocusTime)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                <span className="font-medium">Meditação</span>
                <span className="text-gray-500">{formatDuration(stats.totalMeditationTime)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p><strong>Média por sessão:</strong> {formatDuration(stats.avgSessionLength)}</p>
                  <p><strong>Total geral:</strong> {formatDuration(stats.totalFocusTime + stats.totalMeditationTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div variants={itemVariants} className="insights-container">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            🤖 Insights Personalizados
          </h3>
          <div className="space-y-4">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                className="insight-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {insight.type === 'achievement' && '🏆'}
                    {insight.type === 'productivity' && '📈'}
                    {insight.type === 'wellness' && '🧘'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <p className="text-white/80 text-sm">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Meta Semanal */}
      <motion.div variants={itemVariants} className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Target size={20} />
            Meta Semanal
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Progresso</span>
            <span className="font-semibold">{Math.round(stats.weeklyProgress)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, stats.weeklyProgress)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="text-sm text-gray-600">
            <p>Meta: {stats.weeklyGoal} sessões por semana</p>
            <p>Concluídas: {Math.floor((stats.weeklyProgress / 100) * stats.weeklyGoal)} de {stats.weeklyGoal}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsDashboard;