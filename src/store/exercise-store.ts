import { create } from "zustand"
import {
  search as searchExercises,
  getAllGroupedByInitial,
} from "@/features/workouts/services/exercise-service"
import type { ExerciseDefinition } from "@/features/workouts/types"

interface ExerciseState {
  exercises: ExerciseDefinition[]
  groupedExercises: Record<string, ExerciseDefinition[]>
  isLoading: boolean
  error: string | null

  initialize: () => Promise<void>
  search: (query: string) => Promise<void>
}

const messageFor = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  groupedExercises: {},
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })
    try {
      const all = await searchExercises("")
      const grouped = await getAllGroupedByInitial()
      set({ exercises: all, groupedExercises: grouped, isLoading: false })
    } catch (error) {
      set({ error: messageFor(error), isLoading: false })
    }
  },

  search: async (query: string) => {
    set({ isLoading: true, error: null })
    try {
      const results = await searchExercises(query)
      set({ exercises: results, isLoading: false })
    } catch (error) {
      set({ error: messageFor(error), isLoading: false })
    }
  },
}))
