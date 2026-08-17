"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWorkoutStore } from "@/store/workout-store"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import type { WorkoutTemplate } from "@/features/workouts/types"

import { WorkoutTemplateCard } from "./workout-template-card"

export function WorkoutTemplatesView() {
  const router = useRouter()
  const { startWorkout } = useWorkoutStore()
  const { templates, loadTemplates, isLoading } = useWorkoutTemplateStore()

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleStartTemplate = (template: WorkoutTemplate) => {
    const initialExercises = template.exercises.map((ex, i) => ({
      id: crypto.randomUUID(),
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      exerciseNotes: ex.notes,
      exerciseOrder: i,
      muscles: ex.muscles || [],
      sets: ex.sets || [],
    }))

    startWorkout(template.id, template.version, initialExercises, { name: template.name })
    router.push("/workouts/log")
  }

  if (isLoading) {
    return <div className="text-muted-foreground p-8 text-center">Loading templates...</div>
  }

  if (templates.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground text-sm">No templates yet.</p>
        <Button onClick={() => router.push("/workouts/templates/add")}>
          <Plus className="mr-2 size-4" />
          New Template
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {templates.map((template) => (
        <WorkoutTemplateCard
          key={template.id}
          template={template}
          onStart={handleStartTemplate}
          onEdit={() => router.push(`/workouts/templates/${template.id}/edit`)}
        />
      ))}
    </div>
  )
}
