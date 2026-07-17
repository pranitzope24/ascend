"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Check } from "lucide-react"
import type { WorkoutSet } from "@/features/workouts/types"

interface SetRowProps {
  set: WorkoutSet
  index: number
  onUpdate: (updates: Partial<WorkoutSet>) => void
  onRemove: () => void
}

export function SetRow({ set, index, onUpdate, onRemove }: SetRowProps) {
  return (
    <div className={`grid grid-cols-[3rem_1fr_1fr_4rem] gap-2 items-center py-2 px-3 rounded-lg ${set.completed ? 'bg-primary/10' : 'bg-background'}`}>
      {/* Set Number */}
      <div className="text-center font-medium text-sm text-muted-foreground">
        {index + 1}
      </div>

      {/* Weight */}
      <div>
        <Input 
          type="number" 
          placeholder="kg" 
          className={`h-9 text-center bg-transparent ${set.completed ? 'border-primary/20 bg-primary/5' : ''}`}
          value={set.weight || ""}
          onChange={(e) => onUpdate({ weight: e.target.value ? Number(e.target.value) : undefined })}
          disabled={set.completed}
        />
      </div>

      {/* Reps */}
      <div>
        <Input 
          type="number" 
          placeholder="reps" 
          className={`h-9 text-center bg-transparent ${set.completed ? 'border-primary/20 bg-primary/5' : ''}`}
          value={set.reps || ""}
          onChange={(e) => onUpdate({ reps: e.target.value ? Number(e.target.value) : undefined })}
          disabled={set.completed}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 min-w-8 min-h-8 p-0 aspect-square rounded-full shrink-0 transition-colors border-2 ${set.completed ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-muted-foreground/30 hover:border-primary/50'}`}
          onClick={() => onUpdate({ completed: !set.completed })}
        >
          {set.completed && <Check className="h-4 w-4" strokeWidth={3} />}
        </Button>
        {/* We use a hidden delete button, revealed on swipe in native apps, but here we can just show it or hide on mobile. Let's just show it small. */}
        {!set.completed && (
           <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
             onClick={onRemove}
           >
             <Trash2 className="h-4 w-4" />
           </Button>
        )}
      </div>
    </div>
  )
}
