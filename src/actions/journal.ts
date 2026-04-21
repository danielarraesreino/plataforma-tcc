'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createJournalEntry(content: string, tags?: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    if (!content.trim()) {
      return { error: 'Conteúdo é obrigatório' };
    }

    await prisma.journal.create({
      data: {
        userId: user.id,
        content: content.trim(),
        tags: tags ? JSON.stringify(tags) : null,
      },
    });

    revalidatePath('/journal');

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar entrada do diário:', error);
    return { error: 'Erro ao salvar entrada' };
  }
}

export async function getUserJournalEntries() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const entries = await prisma.journal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return { data: entries };
  } catch (error) {
    console.error('Erro ao buscar entradas do diário:', error);
    return { error: 'Erro ao carregar diário' };
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    await prisma.journal.delete({
      where: { id, userId: user.id },
    });

    revalidatePath('/journal');

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar entrada:', error);
    return { error: 'Erro ao deletar entrada' };
  }
}
