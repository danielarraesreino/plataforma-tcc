import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo à Plataforma TCC Interativa</h1>
        <p>Um espaço seguro para o seu desenvolvimento cognitivo e comportamental.</p>
      </header>
      
      <section className="dashboard-cards">
        <div className="card">
          <h2>Registro de Pensamentos (RPD)</h2>
          <p>Identifique e reestruture pensamentos automáticos disfuncionais.</p>
          <Link href="/rpd" className="btn-primary" style={{ textDecoration: 'none' }}>Acessar RPD</Link>
        </div>
        
        <div className="card">
          <h2>Manejo de Impulsos (GMT)</h2>
          <p>Técnicas de tolerância ao mal-estar e Surfar na Onda (Urge Surfing).</p>
          <Link href="/gmt" className="btn-primary" style={{ textDecoration: 'none' }}>Acessar GMT</Link>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin-top: 2rem;
        }

        .home-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .home-header p {
          color: var(--color-text-muted);
          font-size: 1.125rem;
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .card {
          background: #ffffff;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .card h2 {
          font-size: 1.25rem;
        }

        .card p {
          color: var(--color-text-muted);
          flex-grow: 1;
        }

        .btn-primary {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius-md);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          align-self: flex-start;
          font-size: 0.875rem;
        }

        .btn-primary:hover {
          background-color: #2563eb;
        }
      `}} />
    </div>
  );
}
