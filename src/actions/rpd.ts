'use server';

import { revalidatePath } from 'next/cache';

export async function createRPD(data: {
  userId: string;
  situacao: string;
  pensamentoAutomatico: string;
  emocoesIniciais: { emocao: string; intensidade: number }[];
  comportamento: string;
  distorcoesCognitivas: string[];
  respostaAlternativa: string;
  emocoesFinais: { emocao: string; intensidade: number }[];
  grauCrencaInicial: number;
  grauCrencaFinal: number;
}) {
  // Mocking DB para E2E local sem Docker
  const newRPDId = 'mock-rpd-id-' + Math.random();

  revalidatePath('/dashboard');
  return newRPDId;
}

export async function getRPDs(userId: string) {
  return [];
}
