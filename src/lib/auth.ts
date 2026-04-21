'use server';

import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function registerUser(email: string, password: string, name?: string) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Email já cadastrado' };
    }

    const passwordHash = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        name,
        passwordHash,
      },
    });

    await createSession(user.id);

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Erro ao registrar usuário' };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return { error: 'Credenciais inválidas' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: 'Credenciais inválidas' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await createSession(user.id);

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Erro ao fazer login' };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  
  if (sessionToken) {
    await prisma.session.deleteMany({ where: { token: sessionToken } });
  }
  
  cookieStore.set('session_token', '', { maxAge: 0 });
  return { success: true };
}

export async function createSession(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      id: uuidv4(),
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Math.floor(SESSION_DURATION / 1000),
    path: '/',
  });

  return token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt) : null;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreakCount = user.streakCount;
  let newTotalStreakDays = user.totalStreakDays;

  if (!lastLogin) {
    newStreakCount = 1;
    newTotalStreakDays = 1;
  } else if (lastLogin >= today) {
    // Already logged in today, don't update
    return;
  } else if (lastLogin >= yesterday) {
    // Logged in yesterday, continue streak
    newStreakCount += 1;
    newTotalStreakDays += 1;
  } else {
    // Streak broken
    newStreakCount = 1;
    newTotalStreakDays += 1;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: newStreakCount,
      totalStreakDays: newTotalStreakDays,
      lastLoginAt: new Date(),
    },
  });
}
