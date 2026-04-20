'use server';

import { revalidatePath } from 'next/cache';

export async function createGMT(data: {
  userId: string;
  gatilho: string;
  intensidadeImpulso: number;
  tecnicaUtilizada: string;
  sucesso: boolean;
}) {
  // Mocking DB para E2E local
  const newGMTId = 'mock-gmt-id-' + Math.random();

  revalidatePath('/dashboard');
  return newGMTId;
}

export async function getGMTs(userId: string) {
  return [];
}
