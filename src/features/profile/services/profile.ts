import { prisma } from "@/lib/prisma"

export async function getProfileStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      habits: {
        include: {
          logs: {
            where: { completed: true },
          },
        },
      },
      workoutSessions: true,
    },
  })

  if (!user) return null

  // Calculate statistics
  let maxStreak = 0
  let totalHabitsCompleted = 0

  for (const habit of user.habits) {
    if (habit.longestStreak > maxStreak) {
      maxStreak = habit.longestStreak
    }
    totalHabitsCompleted += habit.logs.length
  }

  const workoutsCount = user.workoutSessions.length
  const totalWorkoutDuration = user.workoutSessions.reduce(
    (total, session) => total + (session.duration || 0),
    0
  )
  const currentLevel = user.profile?.currentLevel || 1
  const currentXP = user.profile?.currentXP || 0
  const coins = user.profile?.coins || 0
  const totalXP = ((currentLevel - 1) * 100) + currentXP
  const nextLevelXP = 100

  return {
    user: {
      name: user.name,
      image: user.image,
    },
    profile: {
      level: currentLevel,
      currentXP,
      nextLevelXP,
      coins,
    },
    stats: {
      longestStreak: maxStreak,
      habitsCompleted: totalHabitsCompleted,
      workouts: workoutsCount,
      totalWorkoutDuration,
      totalXP: totalXP,
    },
  }
}
