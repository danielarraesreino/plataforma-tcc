'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../app/gmt/gmt.css';
import { createGMT } from '@/actions/gmt';

const COPING_CARDS = [
  "Um impulso é como uma onda no mar: ele sobe, atinge o pico e quebra. Vai passar.",
  "Eu já superei impulsos antes. Sou capaz de tolerar esse desconforto.",
  "Agir nesse impulso me trará alívio imediato, mas dor de longo prazo.",
  "Posso observar esse sentimento sem precisar agir sobre ele."
];

export default function GMTDashboard() {
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Form State
  const [gatilho, setGatilho] = useState('');
  const [intensidade, setIntensidade] = useState(5);
  const [tecnica, setTecnica] = useState('Nenhuma');
  const [sucesso, setSucesso] = useState(true);

  // Urge Surfing State
  const [surfInstruction, setSurfInstruction] = useState('Inspire...');

  // Timer logic
  const startTimer = () => {
    setTimeLeft(15 * 60); // 15 minutes
    setIsTimerActive(true);
    setTecnica('Botão Adiar 15 min');
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      alert('15 minutos se passaram. Como está a intensidade do seu impulso agora?');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, timeLeft]);

  // Urge Surfing text animation
  useEffect(() => {
    const texts = ['Inspire...', 'Sinta o impulso...', 'Observe a onda...', 'Expire...'];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setSurfInstruction(texts[i]);
    }, 4000); // changes every 4 seconds (half of the breathe animation)
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSave = async () => {
    await createGMT({
      gatilho,
      intensidadeImpulso: intensidade,
      tecnicaUtilizada: tecnica,
      sucesso
    });
    alert('Registro salvo de forma segura.');
    window.location.href = '/';
  };

  return (
    <div className="gmt-dashboard">
      
      {/* Botão de Emergência / Timer */}
      <div className="gmt-card">
        <h2 className="gmt-card-title">⏳ Botão de Emergência (Adiar 15 min)</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          O pico de um impulso geralmente dura de 10 a 15 minutos. Atrase a ação e o impulso perderá força.
        </p>
        
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
        
        <div className="timer-controls">
          {!isTimerActive && timeLeft === 0 ? (
            <button className="btn-primary" onClick={startTimer} style={{ width: '100%' }}>
              Iniciar Contagem
            </button>
          ) : (
            <button className="btn-secondary" onClick={stopTimer} style={{ width: '100%' }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Cartões de Enfrentamento */}
      <div className="gmt-card">
        <h2 className="gmt-card-title">🃏 Cartões de Enfrentamento</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Lembretes rápidos para ler durante momentos de alta intensidade.
        </p>
        <div className="coping-cards-container">
          {COPING_CARDS.map((card, idx) => (
            <div key={idx} className="coping-card">
              "{card}"
            </div>
          ))}
        </div>
      </div>

      {/* Urge Surfing */}
      <div className="gmt-card full-width">
        <h2 className="gmt-card-title">🌊 Surfar na Onda (Urge Surfing)</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Imagine seu impulso como uma onda. Você não pode pará-la, mas pode surfar nela até que quebre na praia. Apenas observe.
        </p>
        
        <div className="urge-surfing-visual" onClick={() => setTecnica('Urge Surfing')}>
          <div className="wave-circle"></div>
          <div className="wave-circle"></div>
          <div className="wave-circle"></div>
          <div className="surf-instruction">{surfInstruction}</div>
        </div>
      </div>

      {/* Registro de Eficácia */}
      <div className="gmt-card full-width">
        <h2 className="gmt-card-title">📝 Registro Rápido do Impulso</h2>
        <div className="register-impulse-form">
          <div className="form-group">
            <label className="form-label">Qual foi o gatilho? (O que despertou o impulso?)</label>
            <input 
              type="text" 
              className="form-textarea" 
              style={{ minHeight: 'auto', padding: '0.75rem' }}
              value={gatilho}
              onChange={(e) => setGatilho(e.target.value)}
              placeholder="Ex: Tive um dia estressante no trabalho..."
            />
          </div>

          <div className="form-group">
            <div className="range-label">
              <span className="form-label" style={{ marginBottom: 0 }}>Intensidade do impulso:</span>
              <span>{intensidade}/10</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              className="form-range" 
              value={intensidade}
              onChange={(e) => setIntensidade(parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">A técnica foi bem sucedida em evitar o comportamento impulsivo?</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="sucesso" 
                  checked={sucesso} 
                  onChange={() => setSucesso(true)} 
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-success)' }}
                />
                Sim, consegui me segurar.
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="sucesso" 
                  checked={!sucesso} 
                  onChange={() => setSucesso(false)} 
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-warning)' }}
                />
                Não, acabei cedendo.
              </label>
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave}>
            Salvar Registro
          </button>
        </div>
      </div>

    </div>
  );
}
