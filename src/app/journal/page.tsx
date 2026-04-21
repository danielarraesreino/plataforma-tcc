'use client';

import { useState, useEffect } from 'react';
import { createJournalEntry, getUserJournalEntries } from '@/actions/journal';

interface JournalEntry {
  id: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const result = await getUserJournalEntries();
      if (result.data) {
        const transformedEntries = result.data.map((e: any) => ({
          ...e,
          tags: e.tags ? JSON.parse(e.tags) : [],
        }));
        setEntries(transformedEntries);
      }
    } catch (error) {
      console.error('Erro ao carregar diário:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const result = await createJournalEntry(content, tagArray);
      if (result.success) {
        setContent('');
        setTags('');
        loadEntries();
      } else if (result.error) {
        alert(result.error);
      }
    } catch {
      alert('Erro ao criar entrada');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      entry.content.toLowerCase().includes(search) ||
      entry.tags.some(tag => tag.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Diário</h1>
        <p className="text-gray-600 mb-8">Registre seus pensamentos e reflexões</p>

        {/* New Entry Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nova Entrada</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Seu texto *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Escreva sobre seu dia, sentimentos, pensamentos..."
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separadas por vírgula)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="gratidão, ansiedade, progresso, etc."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Entrada'}
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por conteúdo ou tags..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">Nenhuma entrada encontrada</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
                <p className="text-sm text-gray-500 mt-4">
                  {new Date(entry.createdAt).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
