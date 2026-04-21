'use client';

import { useState, useEffect } from 'react';
import { getEducationalContent, getContentById } from '@/actions/education';

interface Content {
  id: string;
  title: string;
  category: string;
  type: 'article' | 'video' | 'exercise';
  duration?: string;
  content: string;
  videoUrl?: string;
}

export default function EducationPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, []);

  async function loadContents() {
    try {
      const result = await getEducationalContent();
      if (result.data) {
        setContents(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', ...Array.from(new Set(contents.map(c => c.category)))];
  const types = ['all', 'article', 'video', 'exercise'];

  const filteredContents = contents.filter(content => {
    if (selectedCategory !== 'all' && content.category !== selectedCategory) return false;
    if (selectedType !== 'all' && content.type !== selectedType) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedContent(null)}
            className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Voltar para lista
          </button>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                {selectedContent.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {selectedContent.type === 'article' ? '📄 Artigo' : 
                 selectedContent.type === 'video' ? '🎥 Vídeo' : '🧘 Exercício'}
              </span>
              {selectedContent.duration && (
                <span className="text-sm text-gray-500">⏱️ {selectedContent.duration}</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">{selectedContent.title}</h1>

            {selectedContent.videoUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <iframe
                  src={selectedContent.videoUrl}
                  title={selectedContent.title}
                  className="w-full aspect-video"
                  allowFullScreen
                />
              </div>
            )}

            <div className="prose max-w-none">
              <div className="text-gray-800 whitespace-pre-wrap">{selectedContent.content}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Central de Educação</h1>
        <p className="text-gray-600 mb-8">Aprenda sobre saúde mental e técnicas de TCC</p>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Todos' : 
                     type === 'article' ? 'Artigos' : 
                     type === 'video' ? 'Vídeos' : 'Exercícios'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">Nenhum conteúdo encontrado</p>
            </div>
          ) : (
            filteredContents.map((content) => (
              <button
                key={content.id}
                onClick={() => setSelectedContent(content)}
                className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">
                    {content.type === 'article' ? '📄' : content.type === 'video' ? '🎥' : '🧘'}
                  </span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    {content.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{content.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {content.content.substring(0, 100)}...
                </p>
                {content.duration && (
                  <p className="text-xs text-gray-500 mt-3">⏱️ {content.duration}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
