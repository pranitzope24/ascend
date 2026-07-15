"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import type { WorkoutTemplate, WorkoutTemplateFormValues, TemplateExercise } from "@/features/workouts/types"
import { Prisma } from "@prisma/client"

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

export async function getAll(): Promise<WorkoutTemplate[]> {
  const userId = await getUserId()
  const templates = await prisma.workoutTemplate.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })
  
  return templates.map(t => ({
    ...t,
    exercises: t.exercises as unknown as TemplateExercise[],
  }))
}

export async function getById(id: string): Promise<WorkoutTemplate | null> {
  const userId = await getUserId()
  const template = await prisma.workoutTemplate.findFirst({
    where: { id, userId },
  })
  
  if (!template) return null
  
  return {
    ...template,
    exercises: template.exercises as unknown as TemplateExercise[],
  }
}

export async function create(values: WorkoutTemplateFormValues): Promise<WorkoutTemplate> {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  
  const template = await prisma.workoutTemplate.create({
    data: {
      id,
      userId,
      name: values.name,
      description: values.description || null,
      exercises: values.exercises as unknown as Prisma.InputJsonValue,
      version: 1,
    }
  })
  
  return {
    ...template,
    exercises: template.exercises as unknown as TemplateExercise[],
  }
}

export async function update(id: string, values: WorkoutTemplateFormValues): Promise<WorkoutTemplate> {
  const userId = await getUserId()
  
  const existing = await prisma.workoutTemplate.findFirst({
    where: { id, userId }
  })
  
  if (!existing) {
    throw new Error("Template not found or unauthorized")
  }

  const updated = await prisma.workoutTemplate.update({
    where: { id },
    data: {
      name: values.name,
      description: values.description || null,
      exercises: values.exercises as unknown as Prisma.InputJsonValue,
      version: existing.version + 1,
    }
  })
  
  return {
    ...updated,
    exercises: updated.exercises as unknown as TemplateExercise[],
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  const userId = await getUserId()
  
  const existing = await prisma.workoutTemplate.findFirst({
    where: { id, userId }
  })
  
  if (!existing) {
    throw new Error("Template not found or unauthorized")
  }

  await prisma.workoutTemplate.delete({
    where: { id }
  })
}

export async function duplicate(id: string): Promise<WorkoutTemplate> {
  const userId = await getUserId()
  
  const existing = await prisma.workoutTemplate.findFirst({
    where: { id, userId }
  })
  
  if (!existing) {
    throw new Error("Template not found or unauthorized")
  }

  const newId = crypto.randomUUID()

  const duplicated = await prisma.workoutTemplate.create({
    data: {
      id: newId,
      userId,
      name: `${existing.name} (Copy)`,
      description: existing.description,
      exercises: existing.exercises as unknown as Prisma.InputJsonValue,
      version: 1,
    }
  })
  
  return {
    ...duplicated,
    exercises: duplicated.exercises as unknown as TemplateExercise[],
  }
}
