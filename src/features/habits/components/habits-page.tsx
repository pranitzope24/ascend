"use client"

import { Plus, Settings } from "lucide-react"
import { useEffect, useState } from "react"

import { ModeToggle } from "@/components/ModeToggle"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HabitCard } from "@/features/habits/components/habit-card"
import { HabitEmptyState } from "@/features/habits/components/habit-empty-state"
import { HabitFormDialog } from "@/features/habits/components/habit-form-dialog"
import { HabitHeatmapDialog } from "@/features/habits/components/habit-heatmap-dialog"
import type { Habit } from "@/features/habits/types"
import { SettingsDialog } from "@/features/settings/components/settings-dialog"
import { useHabitStore } from "@/store/habit-store"

export function HabitsPage() {
  const habits = useHabitStore((state) => state.habits)
  const isLoading = useHabitStore((state) => state.isLoading)
  const error = useHabitStore((state) => state.error)
  const loadHabits = useHabitStore((state) => state.loadHabits)
  const archiveHabit = useHabitStore((state) => state.archiveHabit)
  const logs = useHabitStore((state) => state.logs)
  const toggleHabit = useHabitStore((state) => state.toggleHabit)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [heatmapHabit, setHeatmapHabit] = useState<Habit | null>(null)

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
          <Button aria-label="Settings" onClick={() => setSettingsOpen(true)} size="icon" variant="ghost">
            <Settings className="size-5" />
          </Button>
          <ModeToggle />
          <Button aria-label="Add habit" onClick={openCreate}>
            <Plus data-icon="inline-start" /> <span className="hidden sm:inline">Add habit</span>
          </Button>
          </>
        }
        description="Manage your routines and habits."
        title={
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Habits</span>
          </div>
        }
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
            <HabitCard 
              habit={habit} 
              key={habit.id} 
              isCompleted={logs[habit.id]?.completed ?? false}
              onToggle={(item) => void toggleHabit(item.id)}
              onArchive={(item) => void archiveHabit(item.id)} 
              onEdit={openEdit} 
              onViewHeatmap={setHeatmapHabit}
            />
          ))}
        </div>
      ) : (
        <HabitEmptyState onCreate={openCreate} />
      )}

      <HabitFormDialog habit={selectedHabit} onOpenChange={setDialogOpen} open={dialogOpen} />
      <HabitHeatmapDialog habit={heatmapHabit} open={!!heatmapHabit} onOpenChange={(o) => !o && setHeatmapHabit(null)} />
      <SettingsDialog onOpenChange={setSettingsOpen} open={settingsOpen} />
    </PageShell>
  )
}
