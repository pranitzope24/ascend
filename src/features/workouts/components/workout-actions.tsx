"use client"

import { useEffect } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import { Button } from "@/components/ui/button"
import { History, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { WorkoutTemplate } from "@/features/workouts/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WorkoutActions() {
  const router = useRouter()
  const { startWorkout, activeSessionId } = useWorkoutStore()
  const { templates, loadTemplates } = useWorkoutTemplateStore()

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const handleStartWorkout = () => {
    if (!activeSessionId) {
      startWorkout()
    }
    router.push("/workouts/log")
  }

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
    
    startWorkout(template.id, template.version, initialExercises)
    router.push("/workouts/log")
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => router.push("/workouts/history")}>
        <History className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">History</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Add workout" size="sm">
            <Plus data-icon="inline-start" className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Workout</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Use Template</DropdownMenuLabel>
          {templates.length > 0 ? (
            <>
              {templates.slice(0, 3).map((template) => (
                <DropdownMenuItem key={template.id} onClick={() => handleStartTemplate(template)}>
                  {template.name}
                </DropdownMenuItem>
              ))}
              {templates.length > 3 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/workouts/templates")}>
                    View all templates...
                  </DropdownMenuItem>
                </>
              )}
            </>
          ) : (
            <DropdownMenuItem onClick={() => router.push("/workouts/templates/add")}>
              Create a template...
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleStartWorkout}>
            Add Custom Workout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
