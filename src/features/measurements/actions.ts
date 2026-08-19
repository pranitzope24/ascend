"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getMeasurementLogs() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const logs = await prisma.bodyMeasurementLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  })

  // Convert Decimal to number for the client
  return logs.map((log: any) => ({
    ...log,
    value: Number(log.value),
  }))
}

export async function addMeasurementLog(data: {
  date: Date
  part: string
  side: string | null
  value: number
  unit: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const log = await prisma.bodyMeasurementLog.create({
    data: {
      userId: session.user.id,
      date: data.date,
      part: data.part,
      side: data.side,
      value: data.value,
      unit: data.unit,
    },
  })

  revalidatePath("/profile/measurements")
  return { ...log, value: Number(log.value) }
}

export async function deleteMeasurementLog(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Ensure user owns the log
  const existing = await prisma.bodyMeasurementLog.findUnique({
    where: { id },
  })

  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Unauthorized or not found")
  }

  await prisma.bodyMeasurementLog.delete({
    where: { id },
  })

  revalidatePath("/profile/measurements")
  return { success: true }
}

export async function bulkAddMeasurementLogs(logs: {
  date: Date
  part: string
  side?: string | null
  value: number
}[]) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id
  const startOfDay = (date: Date) => {
    const d = new Date(date)
    d.setUTCHours(0, 0, 0, 0)
    return d
  }

  const transactions = logs.map(data => 
    prisma.bodyMeasurementLog.create({
      data: {
        userId,
        date: startOfDay(data.date),
        part: data.part,
        side: data.side || null,
        value: data.value,
        unit: "in",
      },
    })
  )

  const result = await prisma.$transaction(transactions)
  revalidatePath("/profile/measurements")
  return result.map((log: any) => ({ ...log, value: Number(log.value) }))
}
