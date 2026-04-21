'use server';

import { prisma } from './prisma';
import { getCurrentUser } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/encryption';

export async function createGMT(data: {
  gatilho: string;
  intensidadeImpulso: number;
  tecnicaUtilizada: string;
  sucesso: boolean;
  notas?: string;
  tags?: string[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const newGMT = await prisma.gMT.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      gatilho: encrypt(data.gatilho),
      intensidadeImpulso: data.intensidadeImpulso,
      tecnicaUtilizada: data.tecnicaUtilizada,
      sucesso: data.sucesso,
      notas: data.notas ? encrypt(data.notas) : null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    },
  });

  return { success: true, id: newGMT.id };
}

export async function getGMTs(filters?: { startDate?: Date; endDate?: Date; tags?: string[] }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const where: any = { userId: user.id, isDeleted: false };

  if (filters?.startDate || filters?.endDate) {
    where.dataHora = {};
    if (filters.startDate) where.dataHora.gte = filters.startDate;
    if (filters.endDate) where.dataHora.lte = filters.endDate;
  }

  const gmts = await prisma.gMT.findMany({
    where,
    orderBy: { dataHora: 'desc' },
  });

  return gmts.map(gmt => ({
    ...gmt,
    gatilho: decrypt(gmt.gatilho),
    notas: gmt.notas ? decrypt(gmt.notas) : null,
    tags: gmt.tags ? JSON.parse(gmt.tags) : [],
  }));
}

export async function updateGMT(id: string, data: {
  intensidadeFinal?: number;
  sucesso?: boolean;
  notas?: string;
  tags?: string[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const updateData: any = {};
  if (data.intensidadeFinal !== undefined) updateData.intensidadeFinal = data.intensidadeFinal;
  if (data.sucesso !== undefined) updateData.sucesso = data.sucesso;
  if (data.notas) updateData.notas = encrypt(data.notas);
  if (data.tags) updateData.tags = JSON.stringify(data.tags);

  await prisma.gMT.update({
    where: { id, userId: user.id },
    data: updateData,
  });

  return { success: true };
}

export async function deleteGMT(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  await prisma.gMT.update({
    where: { id, userId: user.id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return { success: true };
}

export async function getGMTStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Não autorizado');

  const gmts = await prisma.gMT.findMany({
    where: { userId: user.id, isDeleted: false },
    select: {
      intensidadeImpulso: true,
      intensidadeFinal: true,
      sucesso: true,
      tecnicaUtilizada: true,
      dataHora: true,
    },
  });

  const totalGMTs = gmts.length;
  const successRate = totalGMTs > 0
    ? (gmts.filter(g => g.sucesso).length / totalGMTs) * 100
    : 0;

  const avgIntensityReduction = gmts.filter(g => g.intensidadeFinal !== null).length > 0
    ? gmts.reduce((acc, g) => acc + (g.intensidadeImpulso - (g.intensidadeFinal || 0)), 0) / 
      gmts.filter(g => g.intensidadeFinal !== null).length
    : 0;

  const techniqueCounts: Record<string, number> = {};
  gmts.forEach(g => {
    techniqueCounts[g.tecnicaUtilizada] = (techniqueCounts[g.tecnicaUtilizada] || 0) + 1;
  });

  // Weekly activity
  const weeklyActivity = Array(7).fill(0);
  const now = new Date();
  gmts.forEach(g => {
    const date = new Date(g.dataHora);
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7) {
      weeklyActivity[6 - daysAgo]++;
    }
  });

  return {
    totalGMTs,
    successRate: Math.round(successRate),
    avgIntensityReduction: Math.round(avgIntensityReduction),
    techniqueCounts,
    weeklyActivity,
  };
}
