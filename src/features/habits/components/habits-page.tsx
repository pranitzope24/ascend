"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { HabitCard } from "@/features/habits/components/habit-card"
import { HabitEmptyState } from "@/features/habits/components/habit-empty-state"
import { HabitFormSheet } from "@/features/habits/components/habit-form-sheet"
import type { Habit } from "@/features/habits/types"
import { useHabitStore } from "@/store/habit-store"

export function HabitsPage() {
  const habits = useHabitStore((state) => state.habits)
  const isLoading = useHabitStore((state) => state.isLoading)
  const error = useHabitStore((state) => state.error)
  const loadHabits = useHabitStore((state) => state.loadHabits)
  const archiveHabit = useHabitStore((state) => state.archiveHabit)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  useEffect(() => {
    void loadHabits()
  }, [loadHabits])

  function openCreate() {
    setSelectedHabit(null)
    setSheetOpen(true)
  }

  function openEdit(habit: Habit) {
    setSelectedHabit(habit)
    setSheetOpen(true)
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-primary">Ascend</p>
          <h1 className="text-3xl font-semibold tracking-tight">Habits</h1>
          <p className="mt-2 text-sm text-muted-foreground">Build the routines that carry you upward.</p>
        </div>
        <div className="flex gap-2">
          <ModeToggle />
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" /> <span className="hidden sm:inline">Add habit</span>
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3" aria-label="Loading habits">
          {[0, 1, 2].map((item) => <div className="h-24 animate-pulse rounded-2xl bg-muted" key={item} />)}
        </div>
      ) : habits.length ? (
        <div className="grid gap-3">
          {habits.map((habit) => (
            <HabitCard habit={habit} key={habit.id} onArchive={(item) => void archiveHabit(item.id)} onEdit={openEdit} />
          ))}
        </div>
      ) : (
        <HabitEmptyState onCreate={openCreate} />
      )}

      <HabitFormSheet habit={selectedHabit} onOpenChange={setSheetOpen} open={sheetOpen} />
    </main>
  )
}
