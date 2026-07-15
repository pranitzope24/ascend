"use server"

import type { WorkoutSession, MuscleSlug } from "@/features/workouts/types"
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns"
import { getSessionsForDateRange } from "./workout-service"

function getSessionVolume(session: WorkoutSession): number {
  let totalVolume = 0

  for (const exercise of session.exerciseSnapshots) {
    for (const set of exercise.sets) {
      if (set.completed && set.weight && set.reps) {
        totalVolume += set.weight * set.reps
      }
    }
  }

  return totalVolume
}

function getSessionRawMuscleScores(session: WorkoutSession): Record<MuscleSlug, number> {
  const scores = {} as Record<MuscleSlug, number>

  for (const exercise of session.exerciseSnapshots) {
    let exerciseVolume = 0
    for (const set of exercise.sets) {
      if (set.completed && set.weight && set.reps) {
        exerciseVolume += set.weight * set.reps
      }
    }

    if (exerciseVolume > 0 && exercise.muscles) {
      for (const mapping of exercise.muscles) {
        scores[mapping.slug] = (scores[mapping.slug] || 0) + exerciseVolume * mapping.contribution
      }
    }
  }

  return scores
}

function normalizeScores(rawScores: Record<string, number>): { slug: string; intensity: number }[] {
  const entries = Object.entries(rawScores).filter(([_, score]) => score > 0)
  if (entries.length === 0) return []

  const maxScore = Math.max(...entries.map(([_, score]) => score))

  return entries.map(([slug, score]) => {
    const ratio = score / maxScore
    let intensity = Math.round(ratio * 5)
    if (intensity < 1) intensity = 1
    if (intensity > 5) intensity = 5
    
    return { slug, intensity }
  })
}

export async function getMuscleIntensitiesForRange(start: Date, end: Date) {
  const sessions = await getSessionsForDateRange(start, end)
  const aggregateScores = {} as Record<string, number>

  for (const session of sessions) {
    const sessionScores = getSessionRawMuscleScores(session)
    for (const [muscle, score] of Object.entries(sessionScores)) {
      aggregateScores[muscle] = (aggregateScores[muscle] || 0) + score
    }
  }

  return normalizeScores(aggregateScores)
}

export async function getTodayMuscleIntensities() {
  const now = new Date()
  return getMuscleIntensitiesForRange(startOfDay(now), endOfDay(now))
}

export async function getThisWeekMuscleIntensities() {
  const now = new Date()
  return getMuscleIntensitiesForRange(
    startOfWeek(now, { weekStartsOn: 1 }),
    endOfWeek(now, { weekStartsOn: 1 })
  )
}
