'use client';

import { useState, useEffect } from 'react';
import { addMoodLog, getUserMoodLogs } from '@/actions/mood';

export default function MoodTrackerPage() {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [view, setView] = useState<'today' | 'history'>('today');

  const moodEmojis = [
    { score: 1, emoji: '😢', label: 'Muito ruim' },
    { score: 2, emoji: '😔', label: 'Ruim' },
    { score: 3, emoji: '😕', label: 'Regular' },
    { score: 4, emoji: '😐', label: 'Ok' },
    { score: 5, emoji: '😌', label: 'Bom' },
    { score: 6, emoji: '😊', label: 'Muito bom' },
    { score: 7, emoji: '😄', label: 'Excelente' },
    { score: 8, emoji: '🤩', label: 'Ótimo' },
    { score: 9, emoji: '🌟', label: 'Fantástico' },
    { score: 10, emoji: '🎉', label: 'Perfeito' },
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const result = await getUserMoodLogs();
      if (result.data) {
        setLogs(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await addMoodLog(score, note);
      if (result.success) {
        setNote('');
        loadLogs();
        alert('Humor registrado com sucesso!');
      } else if (result.error) {
        alert(result.error);
      }
    } catch {
      alert('Erro ao registrar humor');
    } finally {
      setLoading(false);
    }
  };

  const todayLogs = logs.filter(log => {
    const today = new Date();
    const logDate = new Date(log.date);
    return logDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tracker de Humor</h1>
        <p className="text-gray-600 mb-8">Acompanhe como você está se sentindo diariamente</p>

        {/* Today's Entry */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Como você está se sentindo hoje?</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Score Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Selecione seu nível de humor (1-10)
              </label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.score}
                    type="button"
                    onClick={() => setScore(mood.score)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      score === mood.score
                        ? 'border-yellow-500 bg-yellow-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-gray-600">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="O que está influenciando seu humor hoje?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Humor'}
            </button>
          </form>
        </div>

        {/* Today's Logs */}
        {todayLogs.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Registros de Hoje</h2>
            <div className="space-y-3">
              {todayLogs.map((log) => (
                <div key={log.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-3xl mr-4">
                    {moodEmojis.find(m => m.score === log.score)?.emoji || '😐'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Nível {log.score}/10</p>
                    {log.note && <p className="text-sm text-gray-600">{log.note}</p>}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(log.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Toggle */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Histórico</h2>
            <button
              onClick={() => setView(view === 'today' ? 'history' : 'today')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {view === 'today' ? 'Ver histórico completo' : 'Voltar'}
            </button>
          </div>

          {view === 'history' && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum registro encontrado</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl mr-4">
                      {moodEmojis.find(m => m.score === log.score)?.emoji || '😐'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Nível {log.score}/10</p>
                      {log.note && <p className="text-sm text-gray-600">{log.note}</p>}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
