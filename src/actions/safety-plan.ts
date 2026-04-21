'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface SafetyPlanData {
  warningSigns: string | null;
  copingStrategies: string | null;
  supportPeople: string | null;
  professionals: string | null;
  safeEnvironments: string | null;
  emergencyContacts: string | null;
}

export async function getSafetyPlan() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const plan = await prisma.safetyPlan.findFirst({
      where: { userId: user.id },
    });

    if (!plan) return { data: null };

    // Map Prisma names to Frontend names
    const mappedPlan: SafetyPlanData = {
      warningSigns: plan.warningSigns,
      copingStrategies: plan.copingStrategies,
      supportPeople: plan.socialContacts,
      professionals: plan.professionals,
      safeEnvironments: plan.safePlaces,
      emergencyContacts: plan.reasonsToLive,
    };

    return { data: mappedPlan };
  } catch (error) {
    console.error('Erro ao buscar plano de segurança:', error);
    return { error: 'Erro ao carregar plano' };
  }
}

export async function updateSafetyPlan(planData: Partial<SafetyPlanData>) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const data: any = {};
    if (planData.warningSigns !== undefined) data.warningSigns = planData.warningSigns;
    if (planData.copingStrategies !== undefined) data.copingStrategies = planData.copingStrategies;
    if (planData.supportPeople !== undefined) data.socialContacts = planData.supportPeople;
    if (planData.professionals !== undefined) data.professionals = planData.professionals;
    if (planData.safeEnvironments !== undefined) data.safePlaces = planData.safeEnvironments;
    if (planData.emergencyContacts !== undefined) data.reasonsToLive = planData.emergencyContacts;

    // Check if plan exists
    const existing = await prisma.safetyPlan.findFirst({
      where: { userId: user.id },
    });

    if (existing) {
      await prisma.safetyPlan.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.safetyPlan.create({
        data: {
          userId: user.id,
          ...data,
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
