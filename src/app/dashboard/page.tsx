'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserStats } from '@/actions/stats';

interface UserStats {
  currentStreak: number;
  totalRpdEntries: number;
  totalGmtSessions: number;
  averageMood: number | null;
  completedGoals: number;
  totalAchievements: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await getUserStats();
        if (result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const quickActions = [
    { name: 'Registro RPD', href: '/rpd', color: 'bg-blue-500', icon: '📝' },
    { name: 'GMT Session', href: '/gmt', color: 'bg-green-500', icon: '🧘' },
    { name: 'Tracker de Humor', href: '/mood', color: 'bg-yellow-500', icon: '😊' },
    { name: 'Metas', href: '/goals', color: 'bg-purple-500', icon: '🎯' },
    { name: 'Diário', href: '/journal', color: 'bg-pink-500', icon: '📔' },
    { name: 'Plano de Segurança', href: '/safety-plan', color: 'bg-red-500', icon: '🛡️' },
    { name: 'Educação', href: '/education', color: 'bg-indigo-500', icon: '📚' },
    { name: 'Conquistas', href: '/achievements', color: 'bg-orange-500', icon: '🏆' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Acompanhe seu progresso em saúde mental</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🔥</div>
              <div>
                <p className="text-gray-500 text-sm">Sequência Atual</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.currentStreak || 0} dias</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="text-4xl mr-4">📝</div>
              <div>
                <p className="text-gray-500 text-sm">Registros RPD</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalRpdEntries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🧘</div>
              <div>
                <p className="text-gray-500 text-sm">Sessões GMT</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalGmtSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🏆</div>
              <div>
                <p className="text-gray-500 text-sm">Conquistas</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalAchievements || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Overview */}
        {stats?.averageMood !== null && stats?.averageMood !== undefined && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Humor Médio</h2>
            <div className="flex items-center">
              <div className="text-5xl mr-4">
                {stats.averageMood >= 8 ? '😊' : stats.averageMood >= 6 ? '😐' : '😔'}
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-800">{stats.averageMood.toFixed(1)}</p>
                <p className="text-gray-500">de 10</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="font-semibold">{action.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Atividade Recente</h2>
          <p className="text-gray-500">Suas atividades mais recentes aparecerão aqui.</p>
        </div>
      </main>
    </div>
  );
}
