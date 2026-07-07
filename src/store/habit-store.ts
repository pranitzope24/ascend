import { create } from "zustand"

import { habitService } from "@/features/habits/services/habit-service"
import type { Habit, HabitFormValues } from "@/features/habits/types"

interface HabitState {
  habits: Habit[]
  isLoading: boolean
  error: string | null
  loadHabits: () => Promise<void>
  createHabit: (values: HabitFormValues) => Promise<Habit>
  updateHabit: (id: string, values: HabitFormValues) => Promise<Habit>
  archiveHabit: (id: string) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  restoreHabit: (id: string) => Promise<void>
  getHabit: (id: string) => Promise<Habit | undefined>
}

const messageFor = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  isLoading: false,
  error: null,

  loadHabits: async () => {
    set({ isLoading: true, error: null })
    try {
      set({ habits: await habitService.listActive(), isLoading: false })
    } catch (error) {
      set({ error: messageFor(error), isLoading: false })
    }
  },

  createHabit: async (values) => {
    try {
      const habit = await habitService.create(values)
      set((state) => ({ habits: [habit, ...state.habits], error: null }))
      return habit
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  updateHabit: async (id, values) => {
    try {
      const habit = await habitService.update(id, values)
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
      await habitService.setArchived(id, true)
      set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id), error: null }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  deleteHabit: async (id) => {
    try {
      await habitService.delete(id)
      set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id), error: null }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  restoreHabit: async (id) => {
    try {
      await habitService.setArchived(id, false)
      const habit = await habitService.get(id)
      if (habit) set((state) => ({ habits: [habit, ...state.habits], error: null }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  getHabit: (id) => habitService.get(id),
}))
