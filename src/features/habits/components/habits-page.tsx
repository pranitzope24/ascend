"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { ModeToggle } from "@/components/ModeToggle"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { HabitCard } from "@/features/habits/components/habit-card"
import { HabitEmptyState } from "@/features/habits/components/habit-empty-state"
import { HabitFormDialog } from "@/features/habits/components/habit-form-dialog"
import type { Habit } from "@/features/habits/types"
import { useHabitStore } from "@/store/habit-store"

export function HabitsPage() {
  const habits = useHabitStore((state) => state.habits)
  const isLoading = useHabitStore((state) => state.isLoading)
  const error = useHabitStore((state) => state.error)
  const loadHabits = useHabitStore((state) => state.loadHabits)
  const archiveHabit = useHabitStore((state) => state.archiveHabit)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  useEffect(() => {
    void loadHabits()
  }, [loadHabits])

  function openCreate() {
    setSelectedHabit(null)
    setDialogOpen(true)
  }

  function openEdit(habit: Habit) {
    setSelectedHabit(habit)
    setDialogOpen(true)
  }

  return (
    <PageShell>
      <PageHeader
        actions={
          <>
          <ModeToggle />
          <Button aria-label="Add habit" onClick={openCreate}>
            <Plus data-icon="inline-start" /> <span className="hidden sm:inline">Add habit</span>
          </Button>
          </>
        }
        description="Build the routines that carry you upward."
        eyebrow="Ascend"
        title="Habits"
      />

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

      <HabitFormDialog habit={selectedHabit} onOpenChange={setDialogOpen} open={dialogOpen} />
    </PageShell>
  )
}
