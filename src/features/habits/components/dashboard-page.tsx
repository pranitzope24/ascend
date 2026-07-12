"use client"

import { Flame } from "lucide-react"
import { useEffect, useState } from "react"

import { ModeToggle } from "@/components/ModeToggle"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/features/habits/components/dashboard-header"
import { HabitHeatmapDialog } from "@/features/habits/components/habit-heatmap-dialog"
import type { Habit } from "@/features/habits/types"
import { useHabitStore } from "@/store/habit-store"

export function DashboardPage() {
  const habits = useHabitStore((state) => state.habits)
  const isLoading = useHabitStore((state) => state.isLoading)
  const loadHabits = useHabitStore((state) => state.loadHabits)
  const logs = useHabitStore((state) => state.logs)
  const profile = useHabitStore((state) => state.profile)
  const toggleHabit = useHabitStore((state) => state.toggleHabit)
  const [heatmapHabit, setHeatmapHabit] = useState<Habit | null>(null)

  useEffect(() => {
    void loadHabits()
  }, [loadHabits])

  return (
    <PageShell>
      <PageHeader
        actions={
          <>
          <ModeToggle />
          </>
        }
        description="Track your progress"
        title={
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Dashboard</span>
          </div>
        }
      />

      {!isLoading && (
        <DashboardHeader 
          profile={profile} 
          totalHabits={habits.length} 
          completedHabits={habits.filter(h => logs[h.id]?.completed).length} 
        />
      )}

      <div className="mt-8 space-y-4">
        <h3 className="font-semibold text-lg">Today&apos;s Checklist</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div className="h-14 animate-pulse rounded-2xl bg-muted" key={item} />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <p className="text-muted-foreground text-sm">No habits active today. Go to the Habits page to add some!</p>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const isCompleted = logs[habit.id]?.completed ?? false
              return (
                <div 
                  key={habit.id} 
                  className="flex items-center space-x-3 rounded-2xl border bg-card p-4 shadow-sm"
                >
                  <Checkbox 
                    id={`habit-${habit.id}`} 
                    checked={isCompleted}
                    onCheckedChange={() => void toggleHabit(habit.id)}
                    className="h-5 w-5 rounded-md"
                  />
                  <div className="flex flex-1 items-center gap-2 leading-none">
                    <label
                      htmlFor={`habit-${habit.id}`}
                      className="text-sm font-medium leading-none cursor-pointer flex-1"
                    >
                      {habit.title}
                    </label>
                    <span 
                      className="flex items-center gap-1 text-xs font-medium cursor-pointer rounded-full px-1.5 py-0.5 hover:bg-muted ml-auto shrink-0"
                      onClick={(e) => {
                        e.preventDefault()
                        setHeatmapHabit(habit)
                      }}
                    >
                      <Flame className="size-3.5 text-orange-500 fill-orange-500" /> {habit.currentStreak}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <HabitHeatmapDialog habit={heatmapHabit} open={!!heatmapHabit} onOpenChange={(o) => !o && setHeatmapHabit(null)} />
    </PageShell>
  )
}
