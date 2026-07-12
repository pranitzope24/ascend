"use server"

import { prisma } from "@/lib/prisma"
import type { Profile } from "@/features/habits/types"

const DEFAULT_PROFILE = {
  id: "current",
  currentXP: 0,
  currentLevel: 1,
  coins: 0,
}

export async function getProfile(): Promise<Profile> {
  const profile = await prisma.profile.findUnique({
    where: { id: "current" },
  })
  
  if (profile) return profile as Profile
  
  // Create default profile if none exists
  const newProfile = await prisma.profile.create({
    data: DEFAULT_PROFILE,
  })
  return newProfile as Profile
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const profile = await prisma.profile.upsert({
    where: { id: "current" },
    update: updates,
    create: { ...DEFAULT_PROFILE, ...updates },
  })
  return profile as Profile
}

export async function addXP(amount: number): Promise<Profile> {
  const profile = await getProfile()
  let newXP = profile.currentXP + amount
  let newLevel = profile.currentLevel

  while (newXP >= 100) {
    newXP -= 100
    newLevel += 1
  }

  return updateProfile({ 
    currentXP: newXP, 
    currentLevel: newLevel 
  })
}

export async function subtractXP(amount: number): Promise<Profile> {
  const profile = await getProfile()
  let newXP = profile.currentXP - amount
  let newLevel = profile.currentLevel

  while (newXP < 0) {
    if (newLevel > 1) {
      newLevel -= 1
      newXP += 100
    } else {
      newXP = 0
      break
    }
  }

  return updateProfile({
    currentXP: newXP,
    currentLevel: newLevel
  })
}
