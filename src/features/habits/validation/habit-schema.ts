import { z } from "zod"

import { HABIT_CATEGORIES, HabitDifficulty } from "@/features/habits/types"

export const habitSchema = z.object({
  title: z.string().trim().min(1, "Name is required").max(80, "Keep the name under 80 characters"),
  description: z.string().trim().max(300, "Keep the description under 300 characters"),
  icon: z.string().min(1, "Choose an icon"),
  color: z.string().min(1),
  category: z.enum(HABIT_CATEGORIES, { message: "Category is required" }),
  difficulty: z.enum(HabitDifficulty, { message: "Difficulty is required" }),
  xp: z.number().int("XP must be a whole number").positive("XP must be greater than zero"),
})

export type HabitSchemaValues = z.infer<typeof habitSchema>
