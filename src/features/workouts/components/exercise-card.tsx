"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"
import { SetRow } from "./set-row"
import type { ExerciseSnapshot } from "@/features/workouts/types"
import { useWorkoutStore } from "@/store/workout-store"

interface ExerciseCardProps {
  exercise: ExerciseSnapshot
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { addSetToExercise, removeSetFromExercise, updateSet, removeExerciseFromActive } = useWorkoutStore()

  const handleAddSet = () => {
    // Determine default values based on the last set
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
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg text-primary">{exercise.exerciseName}</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeExerciseFromActive(exercise.id)}>
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      {exercise.exerciseNotes && (
        <div className="px-4 pb-2 text-sm text-muted-foreground">
          {exercise.exerciseNotes}
        </div>
      )}

      <CardContent className="p-0">
        <div className="grid grid-cols-[3rem_1fr_1fr_4rem] gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 border-y">
          <div className="text-center">Set</div>
          <div className="text-center">kg</div>
          <div className="text-center">Reps</div>
          <div className="text-right pr-2">Done</div>
        </div>

        <div className="flex flex-col gap-[2px] p-2 bg-muted/10">
          {exercise.sets.map((set, index) => (
            <SetRow 
              key={set.id} 
              set={set} 
              index={index} 
              onUpdate={(updates) => updateSet(exercise.id, set.id, updates)}
              onRemove={() => removeSetFromExercise(exercise.id, set.id)}
            />
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-muted-foreground hover:text-primary transition-colors h-10 border border-dashed"
            onClick={handleAddSet}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
