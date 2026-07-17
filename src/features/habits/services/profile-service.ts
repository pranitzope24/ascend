"use server"

import { prisma } from "@/lib/prisma"
import type { Profile } from "@/features/habits/types"
import { auth } from "@/auth"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

const DEFAULT_PROFILE = {
  currentXP: 0,
  currentLevel: 1,
  coins: 0,
}

export async function getProfile(): Promise<Profile> {
  const userId = await getUserId()
  const profile = await prisma.profile.findUnique({
    where: { userId },
  })

  if (profile) return profile as Profile

  // Create default profile if none exists
  const newProfile = await prisma.profile.create({
    data: { ...DEFAULT_PROFILE, userId },
  })
  return newProfile as Profile
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const userId = await getUserId()
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: updates,
    create: { ...DEFAULT_PROFILE, ...updates, userId },
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
    currentLevel: newLevel,
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
    currentLevel: newLevel,
  })
}
