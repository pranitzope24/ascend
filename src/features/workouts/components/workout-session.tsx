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
    isHistorical,
    historicalDuration,
    addExerciseToActive,
    finishWorkout,
    discardWorkout,
  } = useWorkoutStore()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [elapsed, setElapsed] = useState("0:00")

  useEffect(() => {
    if (!sessionStartTime || isHistorical) return
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
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
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
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col">
      {/* Sticky Header */}
      <div className="bg-background/90 sticky top-0 z-30 flex items-center justify-between border-b px-4 pt-3 pb-3 backdrop-blur-lg">
        <div className="flex flex-col">
          <h1 className="mb-1 text-lg leading-none font-semibold">
            {activeSessionForm?.name || "Workout"}
          </h1>
          <span className="text-primary flex items-center gap-1.5 text-sm font-medium">
            {!isHistorical ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                  <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
                </span>
                {elapsed}
              </>
            ) : (
              <span className="text-muted-foreground font-normal">
                {sessionStartTime?.toLocaleDateString()} •{" "}
                {Math.floor((historicalDuration || 0) / 60)}m
              </span>
            )}
          </span>
        </div>
        <Button size="sm" onClick={handleFinish} className="rounded-full px-4 shadow-sm">
          <Check className="mr-1.5 size-4" />
          Finish
        </Button>
      </div>

      {/* Scrollable Body */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 pb-8">
        {activeExercises.length === 0 ? (
          <div className="bg-muted/20 mt-4 space-y-4 rounded-2xl border border-dashed py-16 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Plus className="text-muted-foreground size-6" />
            </div>
            <h2 className="text-foreground text-lg font-medium">Empty Workout</h2>
            <p className="text-muted-foreground mx-auto max-w-[200px] text-sm">
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
            className="text-primary border-primary/20 hover:bg-primary/5 h-12 w-full rounded-xl font-medium shadow-sm"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="mr-2 size-5" />
            Add Exercise
          </Button>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleDiscard}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center rounded-full px-4 py-2 text-sm transition-colors"
              type="button"
            >
              <X className="mr-1.5 size-4" />
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
            sets: [],
          })
        }}
      />
    </div>
  )
}
