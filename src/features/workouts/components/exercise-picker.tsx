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
      <div className="flex flex-col h-full space-y-4 pb-4">
        <div className="relative p-1 -m-1 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search exercises..." 
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mt-2">
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading exercises...</div>
          ) : (
            <div className="space-y-1">
              {exercises.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No exercises found.</div>
              ) : (
                exercises.map((ex) => (
                  <Button 
                    key={ex.id} 
                    variant="ghost" 
                    className="w-full justify-start font-normal h-auto py-3"
                    onClick={() => handleSelect(ex)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{ex.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{ex.category}</span>
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
