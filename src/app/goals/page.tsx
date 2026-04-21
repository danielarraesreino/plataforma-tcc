'use client';

import { useState, useEffect } from 'react';
import { createGoal, getUserGoals, updateGoal } from '@/actions/goals';

interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetDate: Date | null;
  completed: boolean;
  createdAt: Date;
}

export default function GoalsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const result = await getUserGoals();
      if (result.data) {
        const transformedGoals = result.data.map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          targetDate: g.endDate,
          completed: g.status === 'completed',
          createdAt: g.createdAt,
        }));
        setGoals(transformedGoals);
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createGoal(
        title,
        description || undefined,
        targetDate ? new Date(targetDate) : undefined
      );
      if (result.success) {
        setTitle('');
        setDescription('');
        setTargetDate('');
        loadGoals();
      } else if (result.error) {
        alert(result.error);
      }
    } catch {
      alert('Erro ao criar meta');
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = async (id: string, completed: boolean) => {
    try {
      await updateGoal(id, { completed: !completed });
      loadGoals();
    } catch {
      alert('Erro ao atualizar meta');
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  const activeCount = goals.filter(g => !g.completed).length;
  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Metas</h1>
        <p className="text-gray-600 mb-8">Defina e acompanhe suas metas de saúde mental</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-purple-600">{goals.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-orange-600">{activeCount}</p>
            <p className="text-sm text-gray-600">Ativas</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center">
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            <p className="text-sm text-gray-600">Completas</p>
          </div>
        </div>

        {/* Create Goal Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nova Meta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título da meta *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Meditar 10 minutos por dia"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Detalhes sobre sua meta..."
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data alvo (opcional)
              </label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Meta'}
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todas ({goals.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'active'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ativas ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'completed'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completas ({completedCount})
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">Nenhuma meta encontrada</p>
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <div
                key={goal.id}
                className={`bg-white rounded-xl shadow-md p-6 transition ${
                  goal.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleGoal(goal.id, goal.completed)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      goal.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {goal.completed && <span>✓</span>}
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        goal.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-gray-600 mt-1">{goal.description}</p>
                    )}
                    {goal.targetDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        📅 Alvo: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Criada em {new Date(goal.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
