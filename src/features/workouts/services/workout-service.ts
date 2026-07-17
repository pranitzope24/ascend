"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import type {
  WorkoutSession,
  WorkoutSessionFormValues,
  ExerciseSnapshot,
} from "@/features/workouts/types"
import { Prisma } from "@prisma/client"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function getAllSessions(): Promise<WorkoutSession[]> {
  const userId = await getUserId()
  const sessions = await prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
  })

  // Cast JSONB back to the correct type
  return sessions.map((s) => ({
    ...s,
    exerciseSnapshots: s.exerciseSnapshots as unknown as ExerciseSnapshot[],
  }))
}

export async function getSessionById(id: string): Promise<WorkoutSession | null> {
  const userId = await getUserId()
  const session = await prisma.workoutSession.findFirst({
    where: { id, userId },
  })

  if (!session) return null

  return {
    ...session,
    exerciseSnapshots: session.exerciseSnapshots as unknown as ExerciseSnapshot[],
  }
}

export async function getSessionsForDateRange(start: Date, end: Date): Promise<WorkoutSession[]> {
  const userId = await getUserId()
  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId,
      startedAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { startedAt: "asc" },
  })

  return sessions.map((s) => ({
    ...s,
    exerciseSnapshots: s.exerciseSnapshots as unknown as ExerciseSnapshot[],
  }))
}

export async function saveSession(
  id: string,
  values: WorkoutSessionFormValues,
  exerciseSnapshots: ExerciseSnapshot[],
  templateId?: string,
  templateVersion?: number,
  clientStartedAt?: Date,
  clientDuration?: number
): Promise<WorkoutSession> {
  const userId = await getUserId()

  const existing = await prisma.workoutSession.findFirst({
    where: { id, userId },
  })

  const now = new Date()
  const startedAt = clientStartedAt || existing?.startedAt || now
  const duration = clientDuration ?? Math.floor((now.getTime() - startedAt.getTime()) / 1000)

  // Use upsert to handle both creation and update, or just create/update
  const data = {
    userId,
    name: values.name,
    notes: values.notes || null,
    templateId: templateId || null,
    templateVersion: templateVersion || null,
    startedAt,
    completedAt: now,
    duration,
    exerciseSnapshots: exerciseSnapshots as unknown as Prisma.InputJsonValue,
  }

  const session = await prisma.workoutSession.upsert({
    where: { id },
    update: data,
    create: {
      id,
      ...data,
    },
  })

  return {
    ...session,
    exerciseSnapshots: session.exerciseSnapshots as unknown as ExerciseSnapshot[],
  }
}

export async function deleteSession(id: string): Promise<void> {
  const userId = await getUserId()
  const existing = await prisma.workoutSession.findFirst({
    where: { id, userId },
  })

  if (!existing) throw new Error("Unauthorized or not found")

  await prisma.workoutSession.delete({
    where: { id },
  })
}
