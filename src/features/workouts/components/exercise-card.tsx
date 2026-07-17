"use client"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ExerciseSnapshot } from "@/features/workouts/types"
import { useWorkoutStore } from "@/store/workout-store"
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react"
import { SetRow } from "./set-row"

interface ExerciseCardProps {
  exercise: ExerciseSnapshot
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { addSetToExercise, removeSetFromExercise, updateSet, removeExerciseFromActive } =
    useWorkoutStore()

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1]
    const defaultReps = lastSet ? lastSet.reps : undefined
    const defaultWeight = lastSet ? lastSet.weight : undefined

    addSetToExercise(exercise.id, {
      reps: defaultReps,
      weight: defaultWeight,
      completed: false,
    })
  }

  return (
    <Card className="overflow-hidden transition-colors" size="sm">
      <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 pb-2 sm:gap-4">
        {/* <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Dumbbell className="size-5" />
        </div> */}
        <div className="min-w-0">
          <CardTitle className="truncate text-base">{exercise.exerciseName}</CardTitle>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-muted-foreground text-xs">{exercise.sets.length} sets</span>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="text-muted-foreground h-8 w-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAddSet}>
                <Plus className="mr-2 size-4" /> Add Set
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} disabled>
                <Pencil className="mr-2 size-4" /> Add Note
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => removeExerciseFromActive(exercise.id)}
                className="text-destructive focus:bg-destructive/10"
              >
                <Trash className="mr-2 size-4" /> Remove Exercise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      {exercise.exerciseNotes && (
        <div className="text-muted-foreground px-4 pb-2 text-xs italic">
          {exercise.exerciseNotes}
        </div>
      )}

      <CardContent className="pt-0">
        <div className="mt-2 flex flex-col gap-1">
          {exercise.sets.map((set, index) => (
            <SetRow
              key={set.id}
              set={set}
              index={index}
              onUpdate={(updates) => updateSet(exercise.id, set.id, updates)}
              onRemove={() => removeSetFromExercise(exercise.id, set.id)}
            />
          ))}

          <button
            className="text-primary/80 hover:text-primary hover:bg-primary/10 mx-auto mt-2 flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            onClick={handleAddSet}
            type="button"
          >
            <Plus className="mr-1.5 size-3.5" />
            Add Set
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
