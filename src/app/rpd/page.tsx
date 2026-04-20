import React from 'react';
import RPDForm from '@/components/RPDForm';

export default function RPDPage() {
  return (
    <div className="rpd-container">
      <header className="rpd-header">
        <h1>Registro de Pensamentos</h1>
        <p>Um processo guiado para reestruturação cognitiva</p>
      </header>
      
      <RPDForm />
    </div>
  );
}
