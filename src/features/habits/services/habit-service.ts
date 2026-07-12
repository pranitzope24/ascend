"use server"

import type { Habit, HabitFormValues, HabitLog } from "@/features/habits/types"
import { prisma } from "@/lib/prisma"

export async function listActiveHabits(): Promise<Habit[]> {
  const habits = await prisma.habit.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
  })
  return habits as Habit[]
}

export async function getHabit(id: string): Promise<Habit | null> {
  const habit = await prisma.habit.findUnique({
    where: { id },
  })
  return habit as Habit | null
}

export async function createHabit(values: HabitFormValues): Promise<Habit> {
  const habit = await prisma.habit.create({
    data: values,
  })
  return habit as Habit
}

export async function updateHabit(id: string, values: HabitFormValues): Promise<Habit> {
  const habit = await prisma.habit.update({
    where: { id },
    data: values,
  })
  return habit as Habit
}

export async function setHabitArchived(id: string, isArchived: boolean): Promise<void> {
  await prisma.habit.update({
    where: { id },
    data: { isArchived },
  })
}

export async function deleteHabit(id: string): Promise<void> {
  // Logs will be deleted by Cascade relation
  await prisma.habit.delete({
    where: { id },
  })
}

export async function getHabitLogs(habitId: string): Promise<HabitLog[]> {
  const logs = await prisma.habitLog.findMany({
    where: { habitId },
    orderBy: { date: "asc" },
  })
  return logs as unknown as HabitLog[]
}

export async function getAllHabitLogs(): Promise<HabitLog[]> {
  const logs = await prisma.habitLog.findMany({
    orderBy: { date: "asc" },
  })
  return logs as unknown as HabitLog[]
}

export async function getLogsForDate(date: string): Promise<Record<string, HabitLog>> {
  const logs = await prisma.habitLog.findMany({
    where: { date },
  })
  
  return logs.reduce((acc: any, log: any) => {
    acc[log.habitId] = log as unknown as HabitLog
    return acc
  }, {} as Record<string, HabitLog>)
}

export async function toggleHabitCompletion(habitId: string, date: string, completed: boolean): Promise<{ log: HabitLog, habit: Habit | null }> {
  const completedAt = completed ? new Date() : null
  
  // Upsert the log
  const log = await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId,
        date,
      }
    },
    update: {
      completed,
      completedAt,
    },
    create: {
      habitId,
      date,
      completed,
      completedAt,
    }
  })

  // Calculate Streak
  const habit = await prisma.habit.findUnique({ where: { id: habitId } })
  let updatedHabit = habit
  if (habit) {
    if (completed) {
      // Mark as completed
      // Calculate yesterday's date
      const d = new Date(date)
      d.setDate(d.getDate() - 1)
      const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

      let newStreak = habit.currentStreak
      if (habit.lastCompletedDate === yesterday) {
        // Continue streak
        newStreak += 1
      } else if (habit.lastCompletedDate !== date) {
        // Missed a day or more, restart streak
        newStreak = 1
      }
      
      const newLongestStreak = Math.max(habit.longestStreak, newStreak)
      const newLastCompletedDate = (!habit.lastCompletedDate || date > habit.lastCompletedDate) ? date : habit.lastCompletedDate
      
      await prisma.habit.update({
        where: { id: habitId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCompletedDate: newLastCompletedDate,
        }
      })
      
      updatedHabit = await prisma.habit.findUnique({ where: { id: habitId } })
    } else {
      // Mark as incomplete
      // We must recount the streak backwards from the day before `date`
      const logs = await prisma.habitLog.findMany({
        where: { habitId, completed: true, date: { lt: date } },
        orderBy: { date: 'desc' }
      })

      let computedStreak = 0
      const expectedDate = new Date(date)
      expectedDate.setDate(expectedDate.getDate() - 1)
      let lastDateStr: string | null = null

      for (const lg of logs) {
        const expectedDateStr = `${expectedDate.getFullYear()}-${String(expectedDate.getMonth() + 1).padStart(2, "0")}-${String(expectedDate.getDate()).padStart(2, "0")}`
        if (lg.date === expectedDateStr) {
          computedStreak++
          if (!lastDateStr) lastDateStr = lg.date
          expectedDate.setDate(expectedDate.getDate() - 1)
        } else {
          break
        }
      }

      await prisma.habit.update({
        where: { id: habitId },
        data: {
          currentStreak: computedStreak,
          lastCompletedDate: lastDateStr
        }
      })
      
      updatedHabit = await prisma.habit.findUnique({ where: { id: habitId } })
    }
  }
  
  return { log: log as unknown as HabitLog, habit: updatedHabit as unknown as Habit }
}
