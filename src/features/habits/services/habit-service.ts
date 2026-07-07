import { db } from "@/db"
import type { Habit, HabitFormValues } from "@/features/habits/types"

function createId() {
  return crypto.randomUUID()
}

export const habitService = {
  async listActive(): Promise<Habit[]> {
    // IndexedDB does not support booleans as index keys, so filter the local collection.
    const habits = await db.habits.filter((habit) => !habit.isArchived).toArray()
    return habits.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  get(id: string) {
    return db.habits.get(id)
  },

  async create(values: HabitFormValues): Promise<Habit> {
    const now = new Date()
    const habit: Habit = {
      ...values,
      id: createId(),
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    }
    await db.habits.add(habit)
    return habit
  },

  async update(id: string, values: HabitFormValues): Promise<Habit> {
    const existing = await db.habits.get(id)
    if (!existing) throw new Error("Habit not found")

    const habit = { ...existing, ...values, updatedAt: new Date() }
    await db.habits.put(habit)
    return habit
  },

  async setArchived(id: string, isArchived: boolean) {
    const changed = await db.habits.update(id, { isArchived, updatedAt: new Date() })
    if (!changed) throw new Error("Habit not found")
  },

  async delete(id: string) {
    await db.transaction("rw", db.habits, db.habitLogs, async () => {
      await db.habitLogs.where("habitId").equals(id).delete()
      await db.habits.delete(id)
    })
  },
}
