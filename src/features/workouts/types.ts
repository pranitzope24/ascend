import { z } from "zod"

// -----------------------------------------------------------------------------
// ENUMS & CONSTANTS
// -----------------------------------------------------------------------------

export const MUSCLE_SLUGS = [
  "abs",
  "adductors",
  "ankles",
  "biceps",
  "calves",
  "chest",
  "deltoids",
  "feet",
  "forearm",
  "gluteal",
  "hamstring",
  "hands",
  "hair",
  "head",
  "knees",
  "lower-back",
  "neck",
  "obliques",
  "quadriceps",
  "tibialis",
  "trapezius",
  "triceps",
  "upper-back",
  "cardio",
  "other",
] as const

export type MuscleSlug = (typeof MUSCLE_SLUGS)[number]

// -----------------------------------------------------------------------------
// EXERCISE DATABASE
// -----------------------------------------------------------------------------

export const MuscleMappingSchema = z.object({
  slug: z.enum(MUSCLE_SLUGS),
  contribution: z.number().min(0).max(1), // 0 to 1 scale
})
export type MuscleMapping = z.infer<typeof MuscleMappingSchema>

export const ExerciseDefinitionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Exercise name is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  equipment: z.string().optional(),
  difficulty: z.string().optional(),
  isCompound: z.boolean().optional(),
  isUnilateral: z.boolean().optional(),
  defaultRestSeconds: z.number().optional(),
  muscles: z.array(MuscleMappingSchema).default([]),
})
export type ExerciseDefinition = z.infer<typeof ExerciseDefinitionSchema>

// -----------------------------------------------------------------------------
// SET
// -----------------------------------------------------------------------------

export const WorkoutSetSchema = z.object({
  id: z.string(),
  reps: z.number().nullable().optional(),
  weight: z.number().nullable().optional(), // kg or lbs based on settings
  duration: z.number().nullable().optional(), // in seconds
  distance: z.number().nullable().optional(), // in km or miles
  time: z.number().nullable().optional(),
  completed: z.boolean().default(false),
  notes: z.string().nullable().optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
})
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>

// -----------------------------------------------------------------------------
// TEMPLATE
// -----------------------------------------------------------------------------

export const TemplateExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  notes: z.string().nullable().optional(),
  defaultRestTime: z.number().nullable().optional(),
  exerciseOrder: z.number(),
  muscles: z.array(MuscleMappingSchema).default([]),
  sets: z.array(WorkoutSetSchema).default([]), // Optional default sets
})
export type TemplateExercise = z.infer<typeof TemplateExerciseSchema>

export const WorkoutTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  description: z.string().nullable().optional(),
  exercises: z.array(TemplateExerciseSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().default(1),
})
export type WorkoutTemplate = z.infer<typeof WorkoutTemplateSchema>

export const WorkoutTemplateFormSchema = WorkoutTemplateSchema.pick({
  name: true,
  description: true,
  exercises: true,
})
export type WorkoutTemplateFormValues = z.infer<typeof WorkoutTemplateFormSchema>

// -----------------------------------------------------------------------------
// SESSION
// -----------------------------------------------------------------------------

export const ExerciseSnapshotSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  exerciseNotes: z.string().nullable().optional(),
  exerciseOrder: z.number(),
  muscles: z.array(MuscleMappingSchema).default([]),
  sets: z.array(WorkoutSetSchema).default([]),
})
export type ExerciseSnapshot = z.infer<typeof ExerciseSnapshotSchema>

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  templateId: z.string().nullable().optional(),
  templateVersion: z.number().nullable().optional(),
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.date(),
  completedAt: z.date().nullable().optional(),
  duration: z.number().nullable().optional(), // total duration in seconds
  notes: z.string().nullable().optional(),
  exerciseSnapshots: z.array(ExerciseSnapshotSchema).default([]),
})
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>

export const WorkoutSessionFormSchema = WorkoutSessionSchema.pick({
  name: true,
  notes: true,
})
export type WorkoutSessionFormValues = z.infer<typeof WorkoutSessionFormSchema>

// -----------------------------------------------------------------------------
// SETTINGS
// -----------------------------------------------------------------------------

export const WorkoutSettingsSchema = z.object({
  id: z.string(),
  weightUnit: z.enum(["kg", "lbs"]).default("kg"),
  distanceUnit: z.enum(["km", "mi"]).default("km"),
})
export type WorkoutSettings = z.infer<typeof WorkoutSettingsSchema>
