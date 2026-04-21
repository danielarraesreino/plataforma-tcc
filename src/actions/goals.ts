'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createGoal(
  title: string,
  description?: string,
  targetDate?: Date
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    if (!title.trim()) {
      return { error: 'Título é obrigatório' };
    }

    await prisma.goal.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        targetDate: targetDate || null,
      },
    });

    revalidatePath('/goals');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    return { error: 'Erro ao criar meta' };
  }
}

export async function getUserGoals() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return { data: goals };
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    return { error: 'Erro ao carregar metas' };
  }
}

export async function updateGoal(
  id: string,
  data: {
    title?: string;
    description?: string;
    targetDate?: Date;
    completed?: boolean;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    await prisma.goal.update({
      where: { id, userId: user.id },
      data,
    });

    revalidatePath('/goals');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    return { error: 'Erro ao atualizar meta' };
  }
}

export async function deleteGoal(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    await prisma.goal.delete({
      where: { id, userId: user.id },
    });

    revalidatePath('/goals');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    return { error: 'Erro ao deletar meta' };
  }
}
