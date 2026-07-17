"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { ExerciseCard } from "./exercise-card"
import { ExercisePicker } from "./exercise-picker"
import { Button } from "@/components/ui/button"
import { Plus, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function WorkoutSession() {
  const router = useRouter()
  const { 
    activeSessionId, 
    activeSessionForm, 
    activeExercises, 
    sessionStartTime,
    addExerciseToActive,
    finishWorkout,
    discardWorkout 
  } = useWorkoutStore()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [elapsed, setElapsed] = useState("0:00")

  useEffect(() => {
    if (!sessionStartTime) return
    const interval = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60
      setElapsed(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStartTime])

  if (!activeSessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-muted-foreground">No active workout session.</p>
        <Button onClick={() => router.push("/workouts")}>Go Back</Button>
      </div>
    )
  }

  const handleFinish = async () => {
    try {
      await finishWorkout()
      router.push("/workouts")
    } catch (error) {
      console.error(error)
    }
  }

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard this workout?")) {
      discardWorkout()
      router.push("/workouts")
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-5rem)]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b pb-2 pt-2 flex items-center justify-between px-2">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">{activeSessionForm?.name || "Workout"}</h1>
          <span className="text-sm text-primary font-medium">{elapsed}</span>
        </div>
        <Button size="sm" onClick={handleFinish} className="rounded-full">
          <Check className="h-4 w-4 mr-2" />
          Finish
        </Button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 pt-2 pb-6 px-3 lg:px-4 space-y-4">
        {activeExercises.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <h2 className="text-xl font-medium">Empty Workout</h2>
            <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
              Add some exercises to start tracking your sets.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {activeExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}

        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full h-10 text-primary font-medium bg-primary/5 hover:bg-primary/10 border-primary/20"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Exercise
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-2 border-t flex justify-center mb-4">
        <Button variant="ghost" className="text-destructive w-full max-w-xs" onClick={handleDiscard}>
          <X className="h-4 w-4 mr-2" />
          Discard Workout
        </Button>
      </div>

      <ExercisePicker 
        open={pickerOpen} 
        onOpenChange={setPickerOpen} 
        onSelect={(exercise) => {
          addExerciseToActive({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            exerciseOrder: activeExercises.length,
            muscles: exercise.muscles || [],
            sets: []
          })
        }}
      />
    </div>
  )
}
