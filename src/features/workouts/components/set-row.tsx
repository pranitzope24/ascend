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
    <div
      className={`flex items-center justify-between gap-2 rounded-xl border border-transparent px-3 py-1.5 transition-colors ${set.completed ? "bg-primary/10 border-primary/20" : "hover:bg-muted/40"}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-5 text-center text-xs font-bold">{index + 1}</span>

        <div className="bg-background/50 border-border/50 flex items-center gap-1.5 rounded-lg border px-2 py-1">
          <input
            type="number"
            className="focus:ring-ring w-12 rounded-sm bg-transparent py-0.5 text-center text-sm font-medium focus:ring-1 focus:outline-none"
            placeholder="-"
            value={set.weight || ""}
            onChange={(e) =>
              onUpdate({ weight: e.target.value ? Number(e.target.value) : undefined })
            }
            disabled={set.completed}
          />
          <span className="text-muted-foreground text-xs font-medium">kg</span>
          <span className="text-muted-foreground/50 px-0.5 text-xs">×</span>
          <input
            type="number"
            className="focus:ring-ring w-10 rounded-sm bg-transparent py-0.5 text-center text-sm font-medium focus:ring-1 focus:outline-none"
            placeholder="-"
            value={set.reps || ""}
            onChange={(e) =>
              onUpdate({ reps: e.target.value ? Number(e.target.value) : undefined })
            }
            disabled={set.completed}
          />
          <span className="text-muted-foreground text-xs font-medium">reps</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!set.completed && (
          <button
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-md p-1.5 transition-colors"
            onClick={onRemove}
            type="button"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          className={`flex h-7 min-h-7 w-7 min-w-7 shrink-0 items-center justify-center rounded-full border-2 p-0 transition-colors ${
            set.completed
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-muted-foreground/30 hover:border-primary/50"
          }`}
          onClick={() => onUpdate({ completed: !set.completed })}
        >
          {set.completed && <Check className="size-3.5" strokeWidth={3} />}
        </button>
      </div>
    </div>
  )
}
