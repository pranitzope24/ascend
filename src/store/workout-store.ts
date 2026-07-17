import { getThisWeekMuscleIntensities, getTodayMuscleIntensities } from "@/features/workouts/services/analytics-service"
import { deleteSession as deleteSessionApi, getAllSessions, saveSession } from "@/features/workouts/services/workout-service"
import type {
  ExerciseSnapshot,
  WorkoutSession,
  WorkoutSessionFormValues,
  WorkoutSet
} from "@/features/workouts/types"
import { create } from "zustand"

interface WorkoutState {
  // History & Analytics
  sessions: WorkoutSession[]
  todayMuscleIntensities: { slug: string; intensity: number }[]
  thisWeekMuscleIntensities: { slug: string; intensity: number }[]
  isLoading: boolean
  error: string | null

  // Active Session
  activeSessionId: string | null
  activeTemplateId: string | null
  activeTemplateVersion: number | null
  activeSessionForm: WorkoutSessionFormValues | null
  activeExercises: ExerciseSnapshot[]
  sessionStartTime: Date | null
  isHistorical: boolean
  historicalDuration: number | null

  // Actions
  loadSessions: () => Promise<void>
  loadAnalytics: () => Promise<void>
  
  // Active Session Actions
  startWorkout: (templateId?: string, templateVersion?: number, initialExercises?: ExerciseSnapshot[], options?: { isHistorical?: boolean, startedAt?: Date, duration?: number }) => void
  updateWorkoutForm: (values: Partial<WorkoutSessionFormValues>) => void
  addExerciseToActive: (exercise: Omit<ExerciseSnapshot, "id">) => void
  removeExerciseFromActive: (exerciseId: string) => void
  reorderActiveExercises: (startIndex: number, endIndex: number) => void
  addSetToExercise: (exerciseId: string, set: Omit<WorkoutSet, "id">) => void
  removeSetFromExercise: (exerciseId: string, setId: string) => void
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void
  finishWorkout: () => Promise<WorkoutSession>
  discardWorkout: () => void
  deleteSession: (id: string) => Promise<void>
}

const messageFor = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  sessions: [],
  todayMuscleIntensities: [],
  thisWeekMuscleIntensities: [],
  isLoading: false,
  error: null,

  activeSessionId: null,
  activeTemplateId: null,
  activeTemplateVersion: null,
  activeSessionForm: null,
  activeExercises: [],
  sessionStartTime: null,
  isHistorical: false,
  historicalDuration: null,

  loadSessions: async () => {
    set({ isLoading: true, error: null })
    try {
      const sessions = await getAllSessions()
      set({ sessions, isLoading: false })
    } catch (error) {
      set({ error: messageFor(error), isLoading: false })
    }
  },

  loadAnalytics: async () => {
    try {
      const [today, thisWeek] = await Promise.all([
        getTodayMuscleIntensities(),
        getThisWeekMuscleIntensities(),
      ])
      set({ todayMuscleIntensities: today, thisWeekMuscleIntensities: thisWeek })
    } catch (error) {
      console.error("Failed to load analytics", error)
    }
  },

  startWorkout: (templateId, templateVersion, initialExercises = [], options) => {
    set({
      activeSessionId: crypto.randomUUID(),
      activeTemplateId: templateId || null,
      activeTemplateVersion: templateVersion || null,
      activeSessionForm: { name: "Workout Session - Gym", notes: "" },
      activeExercises: initialExercises.map((ex, i) => ({ ...ex, id: crypto.randomUUID(), exerciseOrder: i })),
      sessionStartTime: options?.startedAt || new Date(),
      isHistorical: options?.isHistorical || false,
      historicalDuration: options?.duration || null,
    })
  },

  updateWorkoutForm: (values) => {
    const current = get().activeSessionForm
    if (current) {
      set({ activeSessionForm: { ...current, ...values } })
    }
  },

  addExerciseToActive: (exercise) => {
    const current = get().activeExercises
    set({
      activeExercises: [
        ...current,
        { ...exercise, id: crypto.randomUUID(), exerciseOrder: current.length },
      ],
    })
  },

  removeExerciseFromActive: (exerciseId) => {
    set((state) => ({
      activeExercises: state.activeExercises
        .filter((ex) => ex.id !== exerciseId)
        .map((ex, i) => ({ ...ex, exerciseOrder: i })), // re-index
    }))
  },

  reorderActiveExercises: (startIndex, endIndex) => {
    const result = Array.from(get().activeExercises)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    set({ activeExercises: result.map((ex, i) => ({ ...ex, exerciseOrder: i })) })
  },

  addSetToExercise: (exerciseId, setTemplate) => {
    set((state) => ({
      activeExercises: state.activeExercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [...ex.sets, { ...setTemplate, id: crypto.randomUUID() }],
          }
        }
        return ex
      }),
    }))
  },

  removeSetFromExercise: (exerciseId, setId) => {
    set((state) => ({
      activeExercises: state.activeExercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.filter((s) => s.id !== setId),
          }
        }
        return ex
      }),
    }))
  },

  updateSet: (exerciseId, setId, updates) => {
    set((state) => ({
      activeExercises: state.activeExercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
          }
        }
        return ex
      }),
    }))
  },

  finishWorkout: async () => {
    const state = get()
    if (!state.activeSessionId || !state.activeSessionForm) {
      throw new Error("No active session to finish")
    }

    try {
      const session = await saveSession(
        state.activeSessionId,
        state.activeSessionForm,
        state.activeExercises,
        state.activeTemplateId || undefined,
        state.activeTemplateVersion || undefined,
        state.isHistorical ? state.sessionStartTime || undefined : undefined,
        state.isHistorical ? state.historicalDuration || undefined : undefined
      )

      // Reset state and update sessions/analytics
      set((state) => ({
        sessions: [session, ...state.sessions],
        activeSessionId: null,
        activeTemplateId: null,
        activeTemplateVersion: null,
        activeSessionForm: null,
        activeExercises: [],
        sessionStartTime: null,
        isHistorical: false,
        historicalDuration: null,
      }))
      
      await get().loadAnalytics()
      
      return session
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  discardWorkout: () => {
    set({
      activeSessionId: null,
      activeTemplateId: null,
      activeTemplateVersion: null,
      activeSessionForm: null,
      activeExercises: [],
      sessionStartTime: null,
      isHistorical: false,
      historicalDuration: null,
    })
  },

  deleteSession: async (id: string) => {
    try {
      await deleteSessionApi(id)
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      }))
      await get().loadAnalytics()
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },
}))
