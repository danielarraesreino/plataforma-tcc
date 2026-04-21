'use client';

import { useState, useEffect } from 'react';
import { getSafetyPlan, updateSafetyPlan, type SafetyPlanData } from '@/actions/safety-plan';

export default function SafetyPlanPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState({
    warningSigns: '',
    copingStrategies: '',
    supportPeople: '',
    professionals: '',
    safeEnvironments: '',
    emergencyContacts: '',
  });

  useEffect(() => {
    loadPlan();
  }, []);

  async function loadPlan() {
    setLoading(true);
    try {
      const result = await getSafetyPlan();
      if (result.data) {
        setPlan({
          warningSigns: result.data.warningSigns || '',
          copingStrategies: result.data.copingStrategies || '',
          supportPeople: result.data.supportPeople || '',
          professionals: result.data.professionals || '',
          safeEnvironments: result.data.safeEnvironments || '',
          emergencyContacts: result.data.emergencyContacts || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateSafetyPlan(plan);
      if (result.success) {
        alert('Plano de segurança salvo com sucesso!');
      } else if (result.error) {
        alert(result.error);
      }
    } catch {
      alert('Erro ao salvar plano');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      key: 'warningSigns' as keyof typeof plan,
      title: '⚠️ Sinais de Alerta',
      description: 'O que indica que você está entrando em crise? (pensamentos, emoções, comportamentos)',
      placeholder: 'Ex: Pensamentos acelerados, isolamento social, dificuldade para dormir...',
    },
    {
      key: 'copingStrategies' as keyof typeof plan,
      title: '🧘 Estratégias de Enfrentamento',
      description: 'O que você pode fazer sozinho(a) para se acalmar?',
      placeholder: 'Ex: Respiração profunda, caminhar, ouvir música, meditar...',
    },
    {
      key: 'supportPeople' as keyof typeof plan,
      title: '👥 Pessoas de Apoio',
      description: 'Quem você pode contatar quando precisar? (nome e telefone)',
      placeholder: 'Ex: Maria - (11) 99999-9999, João - (11) 88888-8888...',
    },
    {
      key: 'professionals' as keyof typeof plan,
      title: '👨‍⚕️ Profissionais de Saúde',
      description: 'Seus profissionais de saúde mental (nome, telefone, endereço)',
      placeholder: 'Ex: Dra. Silva - Psicóloga - (11) 77777-7777...',
    },
    {
      key: 'safeEnvironments' as keyof typeof plan,
      title: '🏠 Ambientes Seguros',
      description: 'Lugares onde você se sente seguro(a) e calmo(a)',
      placeholder: 'Ex: Meu quarto, parque da cidade, casa da minha mãe...',
    },
    {
      key: 'emergencyContacts' as keyof typeof plan,
      title: '🚨 Contatos de Emergência',
      description: 'Números de emergência (CVV: 188, SAMU: 192, Bombeiros: 193)',
      placeholder: 'Ex: CVV - 188 (ligação gratuita 24h), SAMU - 192...',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando plano...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Plano de Segurança</h1>
        <p className="text-gray-600 mb-8">
          Um plano personalizado para te ajudar em momentos de crise emocional
        </p>

        {/* Emergency Banner */}
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🚨</span>
            <div>
              <p className="font-semibold text-red-800">Em caso de emergência imediata:</p>
              <p className="text-red-700 mt-1">
                Ligue para o <strong>CVV (188)</strong> - Atendimento 24 horas, gratuito e sigiloso
              </p>
              <p className="text-red-700">
                Ou <strong>SAMU (192)</strong> para emergências médicas
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((section) => (
            <div key={section.key} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{section.description}</p>
              <textarea
                value={plan[section.key]}
                onChange={(e) => setPlan({ ...plan, [section.key]: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={section.placeholder}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 text-lg"
          >
            {saving ? 'Salvando...' : '💾 Salvar Plano de Segurança'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          Este plano é pessoal e confidencial. Mantenha-o atualizado e acessível.
        </p>
      </div>
    </div>
  );
}
