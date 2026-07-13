"use server"

import { prisma } from "@/lib/prisma"
import type { AppSettings } from "@/features/habits/types"
import { auth } from "@/auth"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

const DEFAULT_SETTINGS = {
  theme: "system",
  animations: true,
  notifications: false,
}

export async function getSettings(): Promise<AppSettings> {
  const userId = await getUserId()
  const settings = await prisma.appSettings.findUnique({
    where: { userId },
  })
  
  if (settings) return settings as AppSettings
  
  const newSettings = await prisma.appSettings.create({
    data: { ...DEFAULT_SETTINGS, userId },
  })
  return newSettings as AppSettings
}

export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  const userId = await getUserId()
  const settings = await prisma.appSettings.upsert({
    where: { userId },
    update: updates,
    create: { ...DEFAULT_SETTINGS, ...updates, userId },
  })
  return settings as AppSettings
}
