import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const HABITS = [
  {
    title: "Morning Workout",
    category: "health",
    difficulty: "hard",
    icon: "dumbbell",
    color: "#ef4444", // Red
    xp: 20,
    completionRate: 0.6,
  },
  {
    title: "Drink 8 glasses of water",
    category: "health",
    difficulty: "easy",
    icon: "droplet",
    color: "#0ea5e9", // Blue
    xp: 5,
    completionRate: 0.9,
  },
  {
    title: "10k steps",
    category: "health",
    difficulty: "medium",
    icon: "footprints",
    color: "#10b981", // Green
    xp: 15,
    completionRate: 0.75,
  },
  {
    title: "Meditation",
    category: "mindfulness",
    difficulty: "medium",
    icon: "brain",
    color: "#8b5cf6", // Purple
    xp: 15,
    completionRate: 0.5,
  },
  {
    title: "Deep work session",
    category: "productivity",
    difficulty: "hard",
    icon: "focus",
    color: "#6366f1", // Indigo
    xp: 25,
    completionRate: 0.65,
  },
  {
    title: "Weekend meal prep",
    category: "health",
    difficulty: "medium",
    icon: "chef-hat",
    color: "#f59e0b", // Amber
    xp: 15,
    completionRate: 0.2, // Only on weekends really, but we'll randomize
  },
  {
    title: "Read 20 pages",
    category: "learning",
    difficulty: "easy",
    icon: "book",
    color: "#3b82f6", // Blue
    xp: 10,
    completionRate: 0.8,
  },
  {
    title: "Journaling",
    category: "mindfulness",
    difficulty: "easy",
    icon: "pen-tool",
    color: "#ec4899", // Pink
    xp: 10,
    completionRate: 0.4,
  }
]

async function main() {
  console.log("Cleaning up database...")
  // Delete all existing data
  await prisma.habitLog.deleteMany({})
  await prisma.habit.deleteMany({})
  await prisma.appSettings.deleteMany({})
  await prisma.profile.deleteMany({})
  await prisma.user.deleteMany({})

  console.log("Seeding dummy user...")
  const dummyUser = await prisma.user.create({
    data: {
      email: "dummy@example.com",
      name: "Dummy User",
    }
  })

  console.log("Seeding profile...")
  await prisma.profile.create({
    data: {
      userId: dummyUser.id,
      currentLevel: 5,
      currentXP: 450,
      coins: 120,
    }
  })

  console.log("Seeding habits and logs...")
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Generate dates for the last 365 days
  const dates: Date[] = []
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d)
  }

  for (const habitData of HABITS) {
    const { completionRate, ...hData } = habitData
    
    let currentStreak = 0
    let longestStreak = 0
    let lastCompletedDate: string | null = null

    const logsToCreate = []

    for (const d of dates) {
      // Randomly complete based on completion rate
      // For weekend meal prep, make it much higher on weekends
      let chance = completionRate
      if (hData.title === "Weekend meal prep") {
        chance = (d.getDay() === 0 || d.getDay() === 6) ? 0.8 : 0.05
      }

      const completed = Math.random() < chance
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      
      if (completed) {
        currentStreak++
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }
        lastCompletedDate = dateStr
        
        logsToCreate.push({
          date: dateStr,
          completed: true,
          completedAt: new Date(d.getTime() + 12 * 60 * 60 * 1000), // complete around noon
        })
      } else {
        // If it's today and not completed, don't break the streak yet, but if it's yesterday, break it.
        if (d.getTime() !== today.getTime()) {
          currentStreak = 0
        }
      }
    }

    // Create the habit with calculated streaks
    const createdHabit = await prisma.habit.create({
      data: {
        ...hData,
        description: `Description for ${hData.title}`,
        currentStreak,
        longestStreak,
        lastCompletedDate,
        createdAt: dates[0], // set created to a year ago
        userId: dummyUser.id,
      }
    })

    // Create all logs
    if (logsToCreate.length > 0) {
      await prisma.habitLog.createMany({
        data: logsToCreate.map(log => ({
          ...log,
          habitId: createdHabit.id,
        }))
      })
    }

    console.log(`Created habit: ${hData.title} (Streak: ${currentStreak}, Longest: ${longestStreak})`)
  }

  console.log("Database seeded successfully! 🎉")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

