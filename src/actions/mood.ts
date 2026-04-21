'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addMoodLog(score: number, note?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    if (score < 1 || score > 10) {
      return { error: 'A pontuação deve estar entre 1 e 10' };
    }

    await prisma.moodLog.create({
      data: {
        userId: user.id,
        score,
        note: note || null,
      },
    });

    revalidatePath('/mood');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Erro ao registrar humor:', error);
    return { error: 'Erro ao registrar humor' };
  }
}

export async function getUserMoodLogs() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const logs = await prisma.moodLog.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 100,
    });

    return { data: logs };
  } catch (error) {
    console.error('Erro ao buscar logs de humor:', error);
    return { error: 'Erro ao carregar histórico' };
  }
}
