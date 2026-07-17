"use client"

import { ChevronLeft, ChevronRight, Flame, Loader2, Pencil, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HeatmapGrid } from "@/features/habits/components/heatmap-grid"
import { getAllHabitLogs, toggleHabitCompletion } from "@/features/habits/services/habit-service"
import type { HabitLog } from "@/features/habits/types"
import { cn } from "@/lib/utils"
import { useHabitStore } from "@/store/habit-store"

type ViewMode = "weekly" | "monthly" | "yearly"

export function StreaksPage() {
  const habits = useHabitStore((state) => state.habits)
  const loadHabits = useHabitStore((state) => state.loadHabits)

  const [logsByHabit, setLogsByHabit] = useState<Record<string, Record<string, boolean>>>({})
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<ViewMode>("weekly")
  const [offsetCounter, setOffsetCounter] = useState(0)
  const [isEditing, setIsEditing] = useState(false)

  // We'll use an array of refs for each habit's container to scroll them all
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    void loadHabits()

    getAllHabitLogs()
      .then((data: HabitLog[]) => {
        const map: Record<string, Record<string, boolean>> = {}
        for (const log of data) {
          if (!map[log.habitId]) map[log.habitId] = {}
          map[log.habitId][log.date] = log.completed
        }
        setLogsByHabit(map)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [loadHabits])

  useEffect(() => {
    if (!loading && scrollRefs.current.length > 0) {
      scrollRefs.current.forEach((ref) => {
        if (ref) ref.scrollLeft = ref.scrollWidth
      })
    }
  }, [loading, mode, offsetCounter, habits.length])

  const handleModeChange = (m: ViewMode) => {
    setMode(m)
    setOffsetCounter(0)
    setIsEditing(false)
  }

  const handleToggle = async (habitId: string, date: string, isCompleted: boolean) => {
    // Optimistic update
    setLogsByHabit((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [date]: !isCompleted,
      },
    }))

    try {
      await toggleHabitCompletion(habitId, date, !isCompleted)
      // Refresh habits to update streaks
      await loadHabits()
    } catch (err) {
      console.error("Failed to toggle log in past", err)
      // Revert on error
      setLogsByHabit((prev) => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          [date]: isCompleted,
        },
      }))
    }
  }

  const weeksCount = mode === "yearly" ? 52 : mode === "monthly" ? 4 : 1

  // Base date starts as today, but shifted by the offset
  const today = new Date()
  const baseDate = new Date(today)

  if (mode === "weekly") {
    baseDate.setDate(baseDate.getDate() + offsetCounter * 7)
  } else if (mode === "monthly") {
    baseDate.setDate(baseDate.getDate() + offsetCounter * 28)
  } else if (mode === "yearly") {
    baseDate.setDate(baseDate.getDate() + offsetCounter * 364)
  }

  const currentDayOfWeek = baseDate.getDay()
  const daysToSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek
  const endDate = new Date(baseDate)
  endDate.setDate(baseDate.getDate() + daysToSunday) // Move to Sunday

  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - weeksCount * 7 + 1) // Start on a Monday

  const iterDate = new Date(startDate)

  const monthLabels: { label: string; index: number }[] = []
  let currentMonth = -1

  const weeks: { date: string; isFuture: boolean; dayOfWeek: number }[][] = []

  for (let w = 0; w < weeksCount; w++) {
    const weekDays = []
    for (let d = 0; d < 7; d++) {
      const dateStr = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, "0")}-${String(iterDate.getDate()).padStart(2, "0")}`
      weekDays.push({
        date: dateStr,
        isFuture: iterDate > today,
        dayOfWeek: iterDate.getDay(),
      })
      if (d === 0) {
        if (iterDate.getMonth() !== currentMonth) {
          currentMonth = iterDate.getMonth()
          monthLabels.push({
            label: iterDate.toLocaleString("default", { month: "short" }),
            index: w,
          })
        }
      }
      iterDate.setDate(iterDate.getDate() + 1)
    }
    weeks.push(weekDays)
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: mode === "yearly" || d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })
  const dateRangeLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`

  return (
    <PageShell>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Streaks</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            {mode === "weekly" && (
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="mr-1 size-3" /> : <Pencil className="mr-1 size-3" />}
              </Button>
            )}
            <div className="bg-muted flex rounded-lg p-1">
              {(["weekly", "monthly", "yearly"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                    mode === m
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => handleModeChange(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        }
        description="Your streaks"
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-medium">{dateRangeLabel}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setOffsetCounter((prev) => prev - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setOffsetCounter((prev) => prev + 1)}
            disabled={offsetCounter >= 0}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-8">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : habits.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No habits available. Go to the Habits page to add some!
          </p>
        ) : (
          habits.map((habit, index) => {
            const habitLogs = logsByHabit[habit.id] || {}

            return (
              <div key={habit.id} className="bg-card space-y-3 rounded-2xl border p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                    >
                      <Flame className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{habit.title}</h3>
                      <p className="text-muted-foreground text-xs">{habit.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col text-right">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                        Current
                      </span>
                      <span className="text-lg leading-none font-bold">{habit.currentStreak}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                        Longest
                      </span>
                      <span className="text-lg leading-none font-bold">{habit.longestStreak}</span>
                    </div>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div
                    ref={(el) => {
                      scrollRefs.current[index] = el
                    }}
                    className={cn(
                      "scrollbar-thumb-muted scrollbar-thin scrollbar-track-transparent overflow-x-auto scroll-smooth pb-4",
                      mode !== "yearly" && "overflow-x-hidden"
                    )}
                  >
                    <HeatmapGrid
                      habit={habit}
                      mode={mode}
                      weeks={weeks}
                      logs={habitLogs}
                      monthLabels={monthLabels}
                      isEditing={isEditing}
                      onToggle={(date, isCompleted) => handleToggle(habit.id, date, isCompleted)}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </PageShell>
  )
}
