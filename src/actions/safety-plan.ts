'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getSafetyPlan() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const plan = await prisma.safetyPlan.findFirst({
      where: { userId: user.id },
    });

    return { data: plan };
  } catch (error) {
    console.error('Erro ao buscar plano de segurança:', error);
    return { error: 'Erro ao carregar plano' };
  }
}

export async function updateSafetyPlan(planData: {
  warningSigns?: string;
  copingStrategies?: string;
  supportPeople?: string;
  professionals?: string;
  safeEnvironments?: string;
  emergencyContacts?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    // Check if plan exists
    const existing = await prisma.safetyPlan.findFirst({
      where: { userId: user.id },
    });

    if (existing) {
      // Update existing plan
      await prisma.safetyPlan.update({
        where: { id: existing.id },
        data: planData,
      });
    } else {
      // Create new plan
      await prisma.safetyPlan.create({
        data: {
          userId: user.id,
          ...planData,
        },
      });
    }

    revalidatePath('/safety-plan');

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar plano de segurança:', error);
    return { error: 'Erro ao salvar plano' };
  }
}
