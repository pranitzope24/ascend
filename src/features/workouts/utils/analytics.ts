import type { WorkoutSession, MuscleSlug } from "@/features/workouts/types"

export function getSessionRawMuscleScores(session: WorkoutSession): Record<MuscleSlug, number> {
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

export function normalizeScores(
  rawScores: Record<string, number>
): { slug: string; intensity: number }[] {
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

export function computeIntensitiesForSessions(
  sessions: WorkoutSession[]
): { slug: string; intensity: number }[] {
  const aggregateScores = {} as Record<string, number>

  for (const session of sessions) {
    const sessionScores = getSessionRawMuscleScores(session)
    for (const [muscle, score] of Object.entries(sessionScores)) {
      aggregateScores[muscle] = (aggregateScores[muscle] || 0) + score
    }
  }

  return normalizeScores(aggregateScores)
}
