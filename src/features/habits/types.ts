export const HABIT_CATEGORIES = [
  "Fitness",
  "Learning",
  "Mindfulness",
  "Career",
  "Health",
  "Finance",
  "Relationships",
  "Productivity",
] as const

export type HabitCategory = (typeof HABIT_CATEGORIES)[number]

export enum HabitDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Extreme = "Extreme",
}

export const DEFAULT_XP: Record<HabitDifficulty, number> = {
  [HabitDifficulty.Easy]: 10,
  [HabitDifficulty.Medium]: 20,
  [HabitDifficulty.Hard]: 35,
  [HabitDifficulty.Extreme]: 50,
}

export interface Habit {
  id: string
  title: string
  description: string
  icon: string
  color: string
  category: HabitCategory
  difficulty: HabitDifficulty
  xp: number
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

export type HabitFormValues = Pick<
  Habit,
  "title" | "description" | "icon" | "color" | "category" | "difficulty" | "xp"
>

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
  completedAt: Date | null
}

export interface AppSettings {
  id: "app"
  theme: "light" | "dark" | "system"
  animations: boolean
  notifications: boolean
}

export interface Profile {
  id: "current"
  currentXP: number
  currentLevel: number
  coins: number
}
