"use server"

import type { ExerciseDefinition } from "@/features/workouts/types"
import defaultExercises from "@/features/workouts/data/exercises.json"

export async function search(query: string): Promise<ExerciseDefinition[]> {
  const all = [...(defaultExercises as ExerciseDefinition[])].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  if (!query) {
    return all
  }

  const lowerQuery = query.toLowerCase()
  return all.filter((ex) => ex.name.toLowerCase().includes(lowerQuery))
}

export async function getAllGroupedByInitial(): Promise<Record<string, ExerciseDefinition[]>> {
  const all = [...(defaultExercises as ExerciseDefinition[])].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  const grouped: Record<string, ExerciseDefinition[]> = {}

  all.forEach((ex) => {
    const initial = ex.name.charAt(0).toUpperCase()
    if (!grouped[initial]) {
      grouped[initial] = []
    }
    grouped[initial].push(ex)
  })

  return grouped
}
