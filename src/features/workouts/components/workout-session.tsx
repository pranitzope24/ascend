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
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b pb-3 pt-3 flex items-center justify-between px-4">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg leading-none mb-1">{activeSessionForm?.name || "Workout"}</h1>
          <span className="text-sm text-primary font-medium flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {elapsed}
          </span>
        </div>
        <Button size="sm" onClick={handleFinish} className="rounded-full shadow-sm px-4">
          <Check className="size-4 mr-1.5" />
          Finish
        </Button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 pt-4 pb-8 px-4 max-w-2xl mx-auto w-full">
        {activeExercises.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-muted/20 rounded-2xl border border-dashed mt-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="size-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground">Empty Workout</h2>
            <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
              Add some exercises to start tracking your sets.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <Button 
            variant="outline" 
            className="w-full rounded-xl h-12 text-primary font-medium border-primary/20 hover:bg-primary/5 shadow-sm"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="size-5 mr-2" />
            Add Exercise
          </Button>

          <div className="pt-8 flex justify-center">
            <button 
              onClick={handleDiscard}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center px-4 py-2 rounded-full hover:bg-destructive/10"
              type="button"
            >
              <X className="size-4 mr-1.5" />
              Discard Workout
            </button>
          </div>
        </div>
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
