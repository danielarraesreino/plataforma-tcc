'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logout, getCurrentUser } from '@/actions/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      // In a real app, you'd fetch user settings from backend
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const storedLang = localStorage.getItem('language') as 'pt' | 'en' | null;
      
      if (storedTheme) setTheme(storedTheme);
      if (storedLang) setLanguage(storedLang);

      // Get current user from server component or API
      // For now, we'll just show the settings UI
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLanguageChange = (newLang: 'pt' | 'en') => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    // In a real app, you'd trigger language change here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações</h1>
        <p className="text-gray-600 mb-8">Personalize sua experiência</p>

        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🎨 Aparência</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-6 py-3 rounded-lg border-2 transition ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ☀️ Claro
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-6 py-3 rounded-lg border-2 transition ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  🌙 Escuro
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🌐 Idioma</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleLanguageChange('pt')}
              className={`px-6 py-3 rounded-lg border-2 transition ${
                language === 'pt'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              🇧🇷 Português
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-6 py-3 rounded-lg border-2 transition ${
                language === 'en'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">👤 Conta</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">seu@email.com</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Alterar senha
              </button>
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Exportar dados
              </button>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔒 Privacidade</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Dados criptografados</p>
                <p className="text-sm text-gray-500">Seus registros RPD e GMT são criptografados</p>
              </div>
              <span className="text-green-600 font-semibold">✓ Ativo</span>
            </div>
            <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium">
              Excluir minha conta
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            🚪 Sair da conta
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
