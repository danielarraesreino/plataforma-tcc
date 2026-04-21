'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getUserAchievements() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    // Get all achievements with user progress
    const allAchievements = await prisma.achievement.findMany({
      include: {
        userAchievements: {
          where: { userId: user.id },
        },
      },
    });

    // Transform to include unlocked status
    const achievements = allAchievements.map(ach => {
      const userAch = ach.userAchievements[0];
      return {
        id: ach.id,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        unlocked: !!userAch,
        unlockedAt: userAch?.unlockedAt || null,
      };
    });

    return { data: achievements };
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return { error: 'Erro ao carregar conquistas' };
  }
}

// Helper function to check and unlock achievements
export async function checkAndUnlockAchievements(userId: string, type: string, count?: number) {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { requirementType: type },
    });

    const unlocked: string[] = [];

    for (const achievement of achievements) {
      // Check if already unlocked
      const existing = await prisma.userAchievement.findFirst({
        where: {
          userId,
          achievementId: achievement.id,
        },
      });

      if (existing) continue;

      // Check if requirement is met
      let requirementMet = false;

      switch (type) {
        case 'RPD_ENTRIES':
          if (count !== undefined && count >= achievement.requirementValue) {
            requirementMet = true;
          }
          break;
        case 'GMT_SESSIONS':
          if (count !== undefined && count >= achievement.requirementValue) {
            requirementMet = true;
          }
          break;
        case 'MOOD_LOGS':
          if (count !== undefined && count >= achievement.requirementValue) {
            requirementMet = true;
          }
          break;
        case 'STREAK_DAYS':
          if (count !== undefined && count >= achievement.requirementValue) {
            requirementMet = true;
          }
          break;
        case 'GOALS_COMPLETED':
          if (count !== undefined && count >= achievement.requirementValue) {
            requirementMet = true;
          }
          break;
      }

      if (requirementMet) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
        unlocked.push(achievement.name);
      }
    }

    return unlocked;
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
    return [];
  }
}
