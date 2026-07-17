"use client"

import { useEffect, useState } from "react"
import { useExerciseStore } from "@/store/exercise-store"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { ExerciseDefinition } from "@/features/workouts/types"

interface ExercisePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (exercise: ExerciseDefinition) => void
}

export function ExercisePicker({ open, onOpenChange, onSelect }: ExercisePickerProps) {
  const { exercises, groupedExercises, isLoading, initialize, search } = useExerciseStore()
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (open && exercises.length === 0) {
      initialize()
    }
  }, [open, exercises.length, initialize])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, search])

  const handleSelect = (exercise: ExerciseDefinition) => {
    onSelect(exercise)
    onOpenChange(false)
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Select Exercise"
      className="md:max-h-[80vh]"
    >
      <div className="flex h-full flex-col space-y-4 pb-4">
        <div className="relative -m-1 shrink-0 p-1">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search exercises..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-2 flex-1 space-y-2 overflow-y-auto">
          {isLoading ? (
            <div className="text-muted-foreground flex justify-center p-8">
              Loading exercises...
            </div>
          ) : (
            <div className="space-y-1">
              {exercises.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">No exercises found.</div>
              ) : (
                exercises.map((ex) => (
                  <Button
                    key={ex.id}
                    variant="ghost"
                    className="h-auto w-full justify-start py-3 font-normal"
                    onClick={() => handleSelect(ex)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{ex.name}</span>
                      <span className="text-muted-foreground text-xs capitalize">
                        {ex.category}
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ResponsiveDialog>
  )
}
