'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/encryption';

export async function createRPD(data: {
  situacao: string;
  pensamentoAutomatico: string;
  emocoesIniciais: { emocao: string; intensidade: number }[];
  comportamento?: string;
  distorcoesCognitivas: string[];
  respostaAlternativa: string;
  emocoesFinais: { emocao: string; intensidade: number }[];
  grauCrencaInicial: number;
  grauCrencaFinal: number;
  tags?: string[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const newRPD = await prisma.rPD.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      situacao: encrypt(data.situacao),
      pensamentoAutomatico: encrypt(data.pensamentoAutomatico),
      emocoesIniciais: JSON.stringify(data.emocoesIniciais),
      comportamento: data.comportamento ? encrypt(data.comportamento) : null,
      distorcoesCognitivas: JSON.stringify(data.distorcoesCognitivas),
      respostaAlternativa: encrypt(data.respostaAlternativa),
      emocoesFinais: JSON.stringify(data.emocoesFinais),
      tags: data.tags ? JSON.stringify(data.tags) : null,
      grauCrencaInicial: data.grauCrencaInicial,
      grauCrencaFinal: data.grauCrencaFinal,
    },
  });

  return { success: true, id: newRPD.id };
}

export async function getRPDs(filters?: { startDate?: Date; endDate?: Date; tags?: string[] }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const where: any = { userId: user.id, isDeleted: false };

  if (filters?.startDate || filters?.endDate) {
    where.dataHora = {};
    if (filters.startDate) where.dataHora.gte = filters.startDate;
    if (filters.endDate) where.dataHora.lte = filters.endDate;
  }

  const rpds = await prisma.rPD.findMany({
    where,
    orderBy: { dataHora: 'desc' },
  });

  return rpds.map((rpd: (typeof rpds)[number]) => ({
    ...rpd,
    situacao: decrypt(rpd.situacao),
    pensamentoAutomatico: decrypt(rpd.pensamentoAutomatico),
    comportamento: rpd.comportamento ? decrypt(rpd.comportamento) : null,
    respostaAlternativa: decrypt(rpd.respostaAlternativa),
    emocoesIniciais: JSON.parse(rpd.emocoesIniciais),
    distorcoesCognitivas: JSON.parse(rpd.distorcoesCognitivas),
    emocoesFinais: JSON.parse(rpd.emocoesFinais),
    tags: rpd.tags ? JSON.parse(rpd.tags) : [],
  }));
}

export async function updateRPD(id: string, data: Partial<{
  situacao: string;
  pensamentoAutomatico: string;
  comportamento?: string;
  respostaAlternativa: string;
  tags?: string[];
}>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const updateData: any = {};
  if (data.situacao) updateData.situacao = encrypt(data.situacao);
  if (data.pensamentoAutomatico) updateData.pensamentoAutomatico = encrypt(data.pensamentoAutomatico);
  if (data.comportamento) updateData.comportamento = encrypt(data.comportamento);
  if (data.respostaAlternativa) updateData.respostaAlternativa = encrypt(data.respostaAlternativa);
  if (data.tags) updateData.tags = JSON.stringify(data.tags);

  await prisma.rPD.update({
    where: { id, userId: user.id },
    data: updateData,
  });

  return { success: true };
}

export async function deleteRPD(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  await prisma.rPD.update({
    where: { id, userId: user.id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return { success: true };
}

export async function getRPDStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const rpds = await prisma.rPD.findMany({
    where: { userId: user.id, isDeleted: false },
    select: {
      grauCrencaInicial: true,
      grauCrencaFinal: true,
      dataHora: true,
      distorcoesCognitivas: true,
    },
  });

  const totalRPDs = rpds.length;
  const avgBeliefReduction = rpds.length > 0
    ? rpds.reduce((acc: number, r: (typeof rpds)[number]) => acc + (r.grauCrencaInicial - r.grauCrencaFinal), 0) / rpds.length
    : 0;

  const distortionCounts: Record<string, number> = {};
  rpds.forEach((r: (typeof rpds)[number]) => {
    const distortions: string[] = JSON.parse(r.distorcoesCognitivas);
    distortions.forEach((d: string) => {
      distortionCounts[d] = (distortionCounts[d] || 0) + 1;
    });
  });

  // Weekly activity
  const weeklyActivity = Array(7).fill(0);
  const now = new Date();
  rpds.forEach((r: (typeof rpds)[number]) => {
    const date = new Date(r.dataHora);
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7) {
      weeklyActivity[6 - daysAgo]++;
    }
  });

  return {
    totalRPDs,
    avgBeliefReduction: Math.round(avgBeliefReduction),
    distortionCounts,
    weeklyActivity,
  };
}
