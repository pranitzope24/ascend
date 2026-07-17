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
  const { addSetToExercise, removeSetFromExercise, updateSet, removeExerciseFromActive } = useWorkoutStore()

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
    <Card className="transition-colors overflow-hidden" size="sm">
      <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 pb-2">
        {/* <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Dumbbell className="size-5" />
        </div> */}
        <div className="min-w-0">
          <CardTitle className="truncate text-base">{exercise.exerciseName}</CardTitle>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{exercise.sets.length} sets</span>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
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
              <DropdownMenuItem onClick={() => removeExerciseFromActive(exercise.id)} className="text-destructive focus:bg-destructive/10">
                <Trash className="mr-2 size-4" /> Remove Exercise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      
      {exercise.exerciseNotes && (
        <div className="px-4 pb-2 text-xs text-muted-foreground italic">
          {exercise.exerciseNotes}
        </div>
      )}

      <CardContent className="pt-0">
        <div className="flex flex-col gap-1 mt-2">
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
            className="w-fit mx-auto mt-2 text-xs font-medium text-primary/80 hover:text-primary transition-colors flex items-center py-1.5 px-3 rounded-full hover:bg-primary/10"
            onClick={handleAddSet}
            type="button"
          >
            <Plus className="size-3.5 mr-1.5" />
            Add Set
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
