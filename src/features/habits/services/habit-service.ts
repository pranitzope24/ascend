"use server"

import type { Habit, HabitFormValues, HabitLog } from "@/features/habits/types"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function listActiveHabits(): Promise<Habit[]> {
  const userId = await getUserId()
  const habits = await prisma.habit.findMany({
    where: { isArchived: false, userId },
    orderBy: { createdAt: "desc" },
  })
  return habits as Habit[]
}

export async function getHabit(id: string): Promise<Habit | null> {
  const userId = await getUserId()
  const habit = await prisma.habit.findFirst({
    where: { id, userId },
  })
  return habit as Habit | null
}

export async function createHabit(values: HabitFormValues): Promise<Habit> {
  const userId = await getUserId()
  const habit = await prisma.habit.create({
    data: { ...values, userId },
  })
  return habit as Habit
}

export async function updateHabit(id: string, values: HabitFormValues): Promise<Habit> {
  const userId = await getUserId()
  const existing = await prisma.habit.findFirst({ where: { id, userId } })
  if (!existing) throw new Error("Unauthorized or not found")

  const habit = await prisma.habit.update({
    where: { id },
    data: values,
  })
  return habit as Habit
}

export async function setHabitArchived(id: string, isArchived: boolean): Promise<void> {
  const userId = await getUserId()
  const existing = await prisma.habit.findFirst({ where: { id, userId } })
  if (!existing) throw new Error("Unauthorized or not found")

  await prisma.habit.update({
    where: { id },
    data: { isArchived },
  })
}

export async function deleteHabit(id: string): Promise<void> {
  const userId = await getUserId()
  const existing = await prisma.habit.findFirst({ where: { id, userId } })
  if (!existing) throw new Error("Unauthorized or not found")

  // Logs will be deleted by Cascade relation
  await prisma.habit.delete({
    where: { id },
  })
}

export async function getHabitLogs(habitId: string): Promise<HabitLog[]> {
  const userId = await getUserId()
  const existing = await prisma.habit.findFirst({ where: { id: habitId, userId } })
  if (!existing) throw new Error("Unauthorized or not found")

  const logs = await prisma.habitLog.findMany({
    where: { habitId },
    orderBy: { date: "asc" },
  })
  return logs as unknown as HabitLog[]
}

export async function getAllHabitLogs(): Promise<HabitLog[]> {
  const userId = await getUserId()
  // Join logs with habits to filter by user
  const logs = await prisma.habitLog.findMany({
    where: {
      habit: { userId },
    },
    orderBy: { date: "asc" },
  })
  return logs as unknown as HabitLog[]
}

export async function getLogsForDate(date: string): Promise<Record<string, HabitLog>> {
  const userId = await getUserId()
  const logs = await prisma.habitLog.findMany({
    where: {
      date,
      habit: { userId },
    },
  })

  return logs.reduce(
    (acc: any, log: any) => {
      acc[log.habitId] = log as unknown as HabitLog
      return acc
    },
    {} as Record<string, HabitLog>
  )
}

export async function toggleHabitCompletion(
  habitId: string,
  date: string,
  completed: boolean
): Promise<{ log: HabitLog; habit: Habit | null }> {
  const userId = await getUserId()
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } })
  if (!habit) throw new Error("Unauthorized or not found")

  const completedAt = completed ? new Date() : null

  // Upsert the log
  const log = await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId,
        date,
      },
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
    },
  })

  // Calculate Streak
  let updatedHabit = habit
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
    const newLastCompletedDate =
      !habit.lastCompletedDate || date > habit.lastCompletedDate ? date : habit.lastCompletedDate

    await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCompletedDate: newLastCompletedDate,
      },
    })

    const h = await prisma.habit.findUnique({ where: { id: habitId } })
    if (h) updatedHabit = h as Habit
  } else {
    // Mark as incomplete
    // We must recount the streak backwards from the day before `date`
    const logs = await prisma.habitLog.findMany({
      where: { habitId, completed: true, date: { lt: date } },
      orderBy: { date: "desc" },
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
        lastCompletedDate: lastDateStr,
      },
    })

    const h = await prisma.habit.findUnique({ where: { id: habitId } })
    if (h) updatedHabit = h as Habit
  }

  return { log: log as unknown as HabitLog, habit: updatedHabit as unknown as Habit }
}
