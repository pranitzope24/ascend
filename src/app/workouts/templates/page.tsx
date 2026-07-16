"use client"

import { useEffect } from "react"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import { useWorkoutStore } from "@/store/workout-store"
import { WorkoutTemplateCard } from "@/features/workouts/components/workout-template-card"
import type { WorkoutTemplate } from "@/features/workouts/types"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const router = useRouter()
  const { templates, loadTemplates } = useWorkoutTemplateStore()
  const { startWorkout } = useWorkoutStore()

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleStart = (template: WorkoutTemplate) => {
    // Map template exercises to initial active exercises
    const initialExercises = template.exercises.map((ex, i) => ({
      id: crypto.randomUUID(),
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      exerciseNotes: ex.notes,
      exerciseOrder: i,
      muscles: ex.muscles || [],
      sets: ex.sets || [],
    }))
    
    startWorkout(template.id, template.version, initialExercises)
    router.push("/workouts/log")
  }

  const handleEdit = (template: WorkoutTemplate) => {
    router.push(`/workouts/templates/${template.id}/edit`)
  }

  const handleCreate = () => {
    router.push("/workouts/templates/add")
  }

  return (
    <PageShell>
      <PageHeader 
        title="Templates" 
        description="Manage your reusable workout routines."
        actions={
          <Button size="sm" onClick={handleCreate} className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        }
      />
      <div className="flex-1 p-4 pb-24 space-y-4">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <p className="text-muted-foreground text-center">You have no templates yet.</p>
            <Button variant="outline" onClick={handleCreate}>Create your first template</Button>
          </div>
        ) : (
          templates.map((template) => (
            <WorkoutTemplateCard 
              key={template.id} 
              template={template} 
              onStart={handleStart} 
              onEdit={handleEdit} 
            />
          ))
        )}
      </div>
    </PageShell>
  )
}
