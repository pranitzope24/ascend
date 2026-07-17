
"use client"

import type { WorkoutSet } from "@/features/workouts/types"
import { Check, Trash2 } from "lucide-react"

interface SetRowProps {
  set: WorkoutSet
  index: number
  onUpdate: (updates: Partial<WorkoutSet>) => void
  onRemove: () => void
}

export function SetRow({ set, index, onUpdate, onRemove }: SetRowProps) {
  return (
    <div className={`flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl border border-transparent transition-colors ${set.completed ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/40'}`}>
      <div className="flex items-center gap-3">
        <span className="w-5 text-center text-xs font-bold text-muted-foreground">{index + 1}</span>
        
        <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-lg border border-border/50">
          <input
            type="number"
            className="w-12 bg-transparent text-center text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring rounded-sm py-0.5"
            placeholder="-"
            value={set.weight || ""}
            onChange={(e) => onUpdate({ weight: e.target.value ? Number(e.target.value) : undefined })}
            disabled={set.completed}
          />
          <span className="text-xs font-medium text-muted-foreground">kg</span>
          <span className="text-muted-foreground/50 px-0.5 text-xs">×</span>
          <input
            type="number"
            className="w-10 bg-transparent text-center text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring rounded-sm py-0.5"
            placeholder="-"
            value={set.reps || ""}
            onChange={(e) => onUpdate({ reps: e.target.value ? Number(e.target.value) : undefined })}
            disabled={set.completed}
          />
          <span className="text-xs font-medium text-muted-foreground">reps</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!set.completed && (
          <button
            className="p-1.5 text-muted-foreground hover:text-destructive shrink-0 rounded-md hover:bg-destructive/10 transition-colors"
            onClick={onRemove}
            type="button"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          className={`h-7 w-7 min-w-7 min-h-7 p-0 flex items-center justify-center rounded-full shrink-0 transition-colors border-2 ${
            set.completed 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'bg-background border-muted-foreground/30 hover:border-primary/50'
          }`}
          onClick={() => onUpdate({ completed: !set.completed })}
        >
          {set.completed && <Check className="size-3.5" strokeWidth={3} />}
        </button>
      </div>
    </div>
  )
}
