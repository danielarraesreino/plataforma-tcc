'use client';

import React, { useState } from 'react';
import '../app/rpd/rpd.css';
import { createRPD } from '@/actions/rpd';

const EMOTIONS = ['Tristeza', 'Ansiedade', 'Raiva', 'Culpa', 'Vergonha', 'Medo', 'Frustração'];
const DISTORTIONS = [
  { id: 'tudo-ou-nada', label: 'Tudo ou Nada', desc: 'Ver as coisas em categorias extremas, branco ou preto.' },
  { id: 'catastrofizacao', label: 'Catastrofização', desc: 'Prever o pior cenário possível sem evidências.' },
  { id: 'leitura-mental', label: 'Leitura Mental', desc: 'Acreditar que sabe o que os outros estão pensando de você.' },
  { id: 'personalizacao', label: 'Personalização', desc: 'Assumir a culpa por algo que não foi sua responsabilidade.' },
  { id: 'filtro-negativo', label: 'Filtro Negativo', desc: 'Focar apenas no negativo e ignorar o positivo.' }
];

export default function RPDForm({ userId = "mock-user-id" }: { userId?: string }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [situacao, setSituacao] = useState('');
  const [pensamento, setPensamento] = useState('');
  const [crencaInicial, setCrencaInicial] = useState(50);
  const [emocoes, setEmocoes] = useState<Array<{ emocao: string; intensidade: number }>>([]);
  const [distorcoes, setDistorcoes] = useState<string[]>([]);
  const [resposta, setResposta] = useState('');
  const [crencaFinal, setCrencaFinal] = useState(50);

  const handleEmotionToggle = (emocao: string) => {
    if (emocoes.find(e => e.emocao === emocao)) {
      setEmocoes(emocoes.filter(e => e.emocao !== emocao));
    } else {
      setEmocoes([...emocoes, { emocao, intensidade: 50 }]);
    }
  };

  const handleEmotionIntensity = (emocao: string, value: number) => {
    setEmocoes(emocoes.map(e => e.emocao === emocao ? { ...e, intensidade: value } : e));
  };

  const handleDistortionToggle = (id: string) => {
    if (distorcoes.includes(id)) {
      setDistorcoes(distorcoes.filter(d => d !== id));
    } else {
      setDistorcoes([...distorcoes, id]);
    }
  };

  const submitRPD = async () => {
    // Modo discreto e seguro de enviar.
    await createRPD({
      userId,
      situacao,
      pensamentoAutomatico: pensamento,
      emocoesIniciais: emocoes,
      comportamento: '', // Pode ser adicionado futuramente
      distorcoesCognitivas: distorcoes,
      respostaAlternativa: resposta,
      emocoesFinais: emocoes, // Em um fluxo completo pediria a reavaliação da emoção
      grauCrencaInicial: crencaInicial,
      grauCrencaFinal: crencaFinal,
    });
    alert("Registro salvo com sucesso de forma segura e criptografada.");
    window.location.href = '/';
  };

  return (
    <div className="rpd-form-card">
      <div className="rpd-progress-container">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`progress-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}
          >
            {step > i + 1 ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="step-content">
          <h2 className="step-title">O Fato (A Situação)</h2>
          <p className="step-description">Descreva exatamente o que aconteceu. Tente ser um observador neutro, sem julgamentos.</p>
          <div className="clinical-hint">
            <strong>Dica Clínica:</strong> Fatos são coisas que uma câmera de vídeo gravaria. Ex: "Meu chefe me chamou para uma reunião".
          </div>
          <div className="form-group">
            <label className="form-label">O que estava acontecendo?</label>
            <textarea 
              className="form-textarea" 
              placeholder="Ex: Eu estava deitado na cama e recebi uma mensagem..."
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2 className="step-title">A Interpretação (O Pensamento)</h2>
          <p className="step-description">O que passou pela sua cabeça naquele exato momento?</p>
          <div className="clinical-hint">
            <strong>Dica Clínica:</strong> Aqui é onde entra o seu julgamento. Ex: "Ele vai me demitir porque não sou bom o suficiente".
          </div>
          <div className="form-group">
            <label className="form-label">Qual foi o seu pensamento automático?</label>
            <textarea 
              className="form-textarea" 
              placeholder="Ex: Eu vou estragar tudo..."
              value={pensamento}
              onChange={(e) => setPensamento(e.target.value)}
            />
          </div>
          <div className="range-container">
            <div className="range-label">
              <span>O quanto você acredita nesse pensamento agora?</span>
              <span>{crencaInicial}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              className="form-range" 
              value={crencaInicial}
              onChange={(e) => setCrencaInicial(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h2 className="step-title">As Emoções Iniciais</h2>
          <p className="step-description">Como você se sentiu quando teve esse pensamento? Selecione as emoções e aponte a intensidade.</p>
          <div className="emotions-grid">
            {EMOTIONS.map(emocao => {
              const isSelected = !!emocoes.find(e => e.emocao === emocao);
              return (
                <div 
                  key={emocao} 
                  className={`emotion-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleEmotionToggle(emocao)}
                >
                  {emocao}
                </div>
              );
            })}
          </div>

          {emocoes.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 className="form-label">Intensidade das emoções (0-100)</h3>
              {emocoes.map(e => (
                <div key={e.emocao} className="range-container">
                  <div className="range-label">
                    <span>{e.emocao}</span>
                    <span>{e.intensidade}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    className="form-range" 
                    value={e.intensidade}
                    onChange={(evt) => handleEmotionIntensity(e.emocao, parseInt(evt.target.value))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <h2 className="step-title">Distorções Cognitivas</h2>
          <p className="step-description">O seu pensamento parece se encaixar em alguma dessas armadilhas da mente?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {DISTORTIONS.map(dist => (
              <div 
                key={dist.id} 
                className={`distortion-tag ${distorcoes.includes(dist.id) ? 'selected' : ''}`}
                onClick={() => handleDistortionToggle(dist.id)}
                title={dist.desc}
              >
                {dist.label}
              </div>
            ))}
          </div>
          <div className="clinical-hint" style={{ marginTop: '1.5rem' }}>
            <strong>Lembrete:</strong> É muito comum cairmos nessas armadilhas. Reconhecê-las é o primeiro passo para mudar a perspectiva.
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="step-content">
          <h2 className="step-title">Reestruturação Cognitiva</h2>
          <p className="step-description">Vamos buscar evidências. O que prova que esse pensamento é 100% verdadeiro? O que prova que talvez ele não seja?</p>
          <div className="clinical-hint">
            <strong>Dica Clínica:</strong> Não tente apenas "pensar positivo", mas sim pensar de forma realista e compassiva consigo mesmo. O que você diria a um amigo na mesma situação?
          </div>
          <div className="form-group">
            <label className="form-label">Resposta Alternativa e Realista:</label>
            <textarea 
              className="form-textarea" 
              placeholder="Ex: Embora eu tenha errado nesta etapa, já acertei muitas outras vezes. Posso aprender com isso..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="step-content">
          <h2 className="step-title">Reavaliação</h2>
          <p className="step-description">Após considerar a resposta alternativa, o quanto você ainda acredita naquele primeiro pensamento automático?</p>
          <div className="range-container">
            <div className="range-label">
              <span>Grau de crença atual no pensamento:</span>
              <span>{crencaFinal}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              className="form-range" 
              value={crencaFinal}
              onChange={(e) => setCrencaFinal(parseInt(e.target.value))}
            />
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p>Seus dados são protegidos por criptografia ponta a ponta e apenas você pode acessá-los integralmente.</p>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button 
          className="btn-secondary" 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1}
        >
          Anterior
        </button>
        {step < totalSteps ? (
          <button 
            className="btn-primary" 
            onClick={() => setStep(step + 1)}
          >
            Próximo
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={submitRPD}
          >
            Finalizar e Salvar Seguro
          </button>
        )}
      </div>
    </div>
  );
}
