'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserStats() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get current streak
    const moodLogs = await prisma.moodLog.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 365,
    });

    let currentStreak = 0;
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday

    for (let i = 0; i < 365; i++) {
      const hasLog = moodLogs.some((log: (typeof moodLogs)[number]) => {
        const logDate = new Date(log.timestamp);
        return logDate.getFullYear() === checkDate.getFullYear() &&
               logDate.getMonth() === checkDate.getMonth() &&
               logDate.getDate() === checkDate.getDate();
      });

      if (hasLog) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Get totals
    const [totalRpdEntries, totalGmtSessions, completedGoals, totalAchievements] = await Promise.all([
      prisma.rPD.count({ where: { userId: user.id, isDeleted: false } }),
      prisma.gMT.count({ where: { userId: user.id, isDeleted: false } }),
      prisma.goal.count({ where: { userId: user.id, status: 'completed' } }),
      prisma.userAchievement.count({ where: { userId: user.id } }),
    ]);

    // Get average mood (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMoodLogs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        timestamp: { gte: thirtyDaysAgo },
      },
    });

    const averageMood = recentMoodLogs.length > 0
      ? recentMoodLogs.reduce((sum: number, log: (typeof recentMoodLogs)[number]) => sum + log.mood, 0) / recentMoodLogs.length
      : null;

    return {
      data: {
        currentStreak,
        totalRpdEntries,
        totalGmtSessions,
        averageMood,
        completedGoals,
        totalAchievements,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { error: 'Erro ao carregar estatísticas' };
  }
}
