import { create } from "zustand"

import {
  listActiveHabits,
  getLogsForDate,
  createHabit,
  updateHabit,
  setHabitArchived,
  deleteHabit,
  getHabit,
  toggleHabitCompletion,
} from "@/features/habits/services/habit-service"
import { getProfile, addXP, subtractXP } from "@/features/habits/services/profile-service"
import type { Habit, HabitFormValues, HabitLog, Profile } from "@/features/habits/types"

function getTodayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

interface HabitState {
  habits: Habit[]
  logs: Record<string, HabitLog>
  profile: Profile | null
  selectedDate: string
  isLoading: boolean
  error: string | null
  loadHabits: () => Promise<void>
  createHabit: (values: HabitFormValues) => Promise<Habit>
  updateHabit: (id: string, values: HabitFormValues) => Promise<Habit>
  archiveHabit: (id: string) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  restoreHabit: (id: string) => Promise<void>
  getHabit: (id: string) => Promise<Habit | null>
  loadLogs: (date?: string) => Promise<void>
  toggleHabit: (habitId: string) => Promise<void>
}

const messageFor = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  logs: {},
  profile: null,
  selectedDate: getTodayString(),
  isLoading: false,
  error: null,

  loadHabits: async () => {
    set({ isLoading: true, error: null })
    try {
      const [habits, logs, profile] = await Promise.all([
        listActiveHabits(),
        getLogsForDate(get().selectedDate),
        getProfile(),
      ])
      set({ habits, logs, profile, isLoading: false })
    } catch (error) {
      set({ error: messageFor(error), isLoading: false })
    }
  },

  createHabit: async (values) => {
    try {
      const habit = await createHabit(values)
      set((state) => ({ habits: [habit, ...state.habits], error: null }))
      return habit
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  updateHabit: async (id, values) => {
    try {
      const habit = await updateHabit(id, values)
      set((state) => ({
        habits: state.habits.map((item) => (item.id === id ? habit : item)),
        error: null,
      }))
      return habit
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  archiveHabit: async (id) => {
    try {
      await setHabitArchived(id, true)
      set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id), error: null }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  deleteHabit: async (id) => {
    try {
      await deleteHabit(id)
      set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id), error: null }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  restoreHabit: async (id) => {
    try {
      await setHabitArchived(id, false)
      const habit = await getHabit(id)
      if (habit) set((state) => ({ habits: [habit, ...state.habits], error: null }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  getHabit: (id) => getHabit(id),

  loadLogs: async (date) => {
    const targetDate = date || get().selectedDate
    try {
      const logs = await getLogsForDate(targetDate)
      set({ logs, selectedDate: targetDate, error: null })
    } catch (error) {
      set({ error: messageFor(error) })
    }
  },

  toggleHabit: async (habitId) => {
    const { selectedDate, logs } = get()
    const isCompleted = logs[habitId]?.completed ?? false

    // Optimistic UI update
    set((state) => ({
      logs: {
        ...state.logs,
        [habitId]: {
          ...state.logs[habitId],
          habitId,
          date: selectedDate,
          completed: !isCompleted,
          completedAt: !isCompleted ? new Date() : null,
          id: state.logs[habitId]?.id || "temp-log", // temporary id until server responds
        },
      },
    }))

    try {
      const { log: updatedLog, habit: updatedHabitObj } = await toggleHabitCompletion(
        habitId,
        selectedDate,
        !isCompleted
      )

      let updatedProfile = get().profile
      if (updatedProfile) {
        const habit = get().habits.find((h) => h.id === habitId)
        if (habit) {
          updatedProfile = !isCompleted ? await addXP(habit.xp) : await subtractXP(habit.xp)
        }
      }

      // Confirm with reality
      set((state) => {
        let newHabits = state.habits
        if (updatedHabitObj) {
          newHabits = state.habits.map((item) =>
            item.id === updatedHabitObj.id ? updatedHabitObj : item
          )
        }
        return {
          logs: { ...state.logs, [habitId]: updatedLog },
          habits: newHabits,
          profile: updatedProfile,
          error: null,
        }
      })
    } catch (error) {
      // Revert optimistic update
      set((state) => ({
        logs: {
          ...state.logs,
          [habitId]: logs[habitId],
        },
        error: messageFor(error),
      }))
      throw error
    }
  },
}))
