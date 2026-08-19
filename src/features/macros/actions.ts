"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getMacroLogs() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const logs = await prisma.macroLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  })

  return logs
}

export async function upsertMacroLog(data: {
  date: Date
  calories: number
  protein: number
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Set time to start of day in UTC for consistent daily tracking (optional depending on how date is passed)
  // We'll trust the client to pass the correct Date object representing the day.
  const startOfDay = new Date(data.date)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const existingLog = await prisma.macroLog.findFirst({
    where: {
      userId: session.user.id,
      date: startOfDay,
    },
  })

  let log
  if (existingLog) {
    log = await prisma.macroLog.update({
      where: { id: existingLog.id },
      data: {
        calories: data.calories,
        protein: data.protein,
      },
    })
  } else {
    log = await prisma.macroLog.create({
      data: {
        userId: session.user.id,
        date: startOfDay,
        calories: data.calories,
        protein: data.protein,
      },
    })
  }

  revalidatePath("/")
  return log
}

export async function bulkUpsertMacroLogs(logs: { date: Date; calories: number; protein: number }[]) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  
  const userId = session.user.id
  
  // We need to upsert each individually or use a transaction
  // Prisma doesn't have a bulk upsert (upsertMany), so we use a transaction of upserts.
  const transactions = logs.map(data => {
    const startOfDay = new Date(data.date)
    startOfDay.setUTCHours(0, 0, 0, 0)
    
    return prisma.macroLog.upsert({
      where: {
        userId_date: {
          userId,
          date: startOfDay,
        }
      },
      update: {
        calories: data.calories,
        protein: data.protein,
      },
      create: {
        userId,
        date: startOfDay,
        calories: data.calories,
        protein: data.protein,
      }
    })
  })
  
  const results = await prisma.$transaction(transactions)
  
  revalidatePath("/")
  revalidatePath("/profile/macros")
  
  return results
}
