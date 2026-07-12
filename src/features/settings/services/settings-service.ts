"use server"

import { prisma } from "@/lib/prisma"
import type { AppSettings } from "@/features/habits/types"

const DEFAULT_SETTINGS = {
  id: "app",
  theme: "system",
  animations: true,
  notifications: false,
}

export async function getSettings(): Promise<AppSettings> {
  const settings = await prisma.appSettings.findUnique({
    where: { id: "app" },
  })
  
  if (settings) return settings as AppSettings
  
  const newSettings = await prisma.appSettings.create({
    data: DEFAULT_SETTINGS,
  })
  return newSettings as AppSettings
}

export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  const settings = await prisma.appSettings.upsert({
    where: { id: "app" },
    update: updates,
    create: { ...DEFAULT_SETTINGS, ...updates },
  })
  return settings as AppSettings
}
