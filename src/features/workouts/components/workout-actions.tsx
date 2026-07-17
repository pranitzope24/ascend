"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import { Button } from "@/components/ui/button"
import { History, Plus, Calendar } from "lucide-react"
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
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WorkoutActions() {
  const router = useRouter()
  const { startWorkout, activeSessionId } = useWorkoutStore()
  const { templates, loadTemplates } = useWorkoutTemplateStore()

  const [historicalOpen, setHistoricalOpen] = useState(false)
  const [histDate, setHistDate] = useState(() => new Date().toISOString().slice(0, 16))
  const [histDuration, setHistDuration] = useState("60")

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

  const handleStartHistorical = () => {
    const date = new Date(histDate)
    const durSecs = parseInt(histDuration) * 60
    startWorkout(undefined, undefined, [], { isHistorical: true, startedAt: date, duration: durSecs || 3600 })
    setHistoricalOpen(false)
    router.push("/workouts/log")
  }

  return (
    <>
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
              <Plus className="mr-2 size-4" /> Add Custom Workout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHistoricalOpen(true)}>
              <Calendar className="mr-2 size-4" /> Log Past Workout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ResponsiveDialog
        open={historicalOpen}
        onOpenChange={setHistoricalOpen}
        title="Log Past Workout"
        description="Record a workout you completed previously."
        footer={
          <div className="flex w-full gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setHistoricalOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleStartHistorical} className="flex-1 sm:flex-none">
              Start Logging
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="historical-date">Date & Time</Label>
            <Input 
              id="historical-date" 
              type="datetime-local" 
              value={histDate}
              onChange={(e) => setHistDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="historical-duration">Estimated Duration (minutes)</Label>
            <Input 
              id="historical-duration" 
              type="number" 
              min="1"
              value={histDuration}
              onChange={(e) => setHistDuration(e.target.value)}
            />
          </div>
        </div>
      </ResponsiveDialog>
    </>
  )
}
