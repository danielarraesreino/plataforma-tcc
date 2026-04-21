'use client';

import { useState, useEffect } from 'react';
import { getUserAchievements } from '@/actions/achievements';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: Date | null;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    try {
      const result = await getUserAchievements();
      if (result.data) {
        setAchievements(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const lockedCount = achievements.length - unlockedCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Conquistas</h1>
        <p className="text-gray-600 mb-8">Celebre suas vitórias na jornada de saúde mental</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-orange-600">{achievements.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-green-600">{unlockedCount}</p>
            <p className="text-sm text-gray-600">Desbloqueadas</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-gray-600">{lockedCount}</p>
            <p className="text-sm text-gray-600">Bloqueadas</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-blue-600">
              {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Progresso</p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-md p-6 transition-all ${
                achievement.unlocked
                  ? 'border-2 border-green-500'
                  : 'border-2 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`text-5xl ${
                    achievement.unlocked ? '' : 'grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      achievement.unlocked
                        ? 'text-gray-800'
                        : 'text-gray-500'
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      achievement.unlocked
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      🏆 Desbloqueado em{' '}
                      {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {!achievement.unlocked && (
                    <p className="text-xs text-gray-400 mt-2">🔒 Bloqueado</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mt-8">
            <p className="text-gray-500">Nenhuma conquista disponível no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
