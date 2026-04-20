import React from 'react';
import GMTDashboard from '@/components/GMTForm';

export default function GMTPage() {
  return (
    <div className="gmt-container">
      <header className="gmt-header">
        <h1>Manejo de Impulsos</h1>
        <p>Técnicas de Tolerância ao Mal-estar para momentos de crise</p>
      </header>
      
      <GMTDashboard />
    </div>
  );
}
