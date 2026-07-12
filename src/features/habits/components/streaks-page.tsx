"use client"

import { useEffect, useState, useRef } from "react"
import { Flame, Loader2 } from "lucide-react"

import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getAllHabitLogs } from "@/features/habits/services/habit-service"
import { HeatmapGrid } from "@/features/habits/components/heatmap-grid"
import { useHabitStore } from "@/store/habit-store"
import type { HabitLog } from "@/features/habits/types"
import { cn } from "@/lib/utils"

type ViewMode = "weekly" | "monthly" | "yearly"

export function StreaksPage() {
  const habits = useHabitStore((state) => state.habits)
  const loadHabits = useHabitStore((state) => state.loadHabits)
  
  const [logsByHabit, setLogsByHabit] = useState<Record<string, Record<string, boolean>>>({})
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<ViewMode>("weekly")
  
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
      scrollRefs.current.forEach(ref => {
        if (ref) ref.scrollLeft = ref.scrollWidth
      })
    }
  }, [loading, mode, habits.length])

  const weeksCount = mode === "yearly" ? 52 : mode === "monthly" ? 4 : 1

  // Generate weeks of history up to today (only needed once per render)
  const weeks: { date: string, isFuture: boolean, dayOfWeek: number }[][] = []
  const today = new Date()
  const currentDayOfWeek = today.getDay()
  const daysToSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + daysToSunday) // Move to Sunday
  
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - (weeksCount * 7) + 1) // Start on a Monday
  
  const iterDate = new Date(startDate)
  
  const monthLabels: { label: string; index: number }[] = []
  let currentMonth = -1

  for (let w = 0; w < weeksCount; w++) {
    const weekDays = []
    for (let d = 0; d < 7; d++) {
      const dateStr = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, "0")}-${String(iterDate.getDate()).padStart(2, "0")}`
      weekDays.push({
        date: dateStr,
        isFuture: iterDate > today,
        dayOfWeek: iterDate.getDay()
      })
      if (d === 0) {
        if (iterDate.getMonth() !== currentMonth) {
          currentMonth = iterDate.getMonth()
          monthLabels.push({
            label: iterDate.toLocaleString("default", { month: "short" }),
            index: w
          })
        }
      }
      iterDate.setDate(iterDate.getDate() + 1)
    }
    weeks.push(weekDays)
  }

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
          <div className="flex bg-muted p-1 rounded-lg">
            {(["weekly", "monthly", "yearly"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors",
                  mode === m ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-8 space-y-8">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : habits.length === 0 ? (
          <p className="text-muted-foreground text-sm">No habits available. Go to the Habits page to add some!</p>
        ) : (
          habits.map((habit, index) => {
            const habitLogs = logsByHabit[habit.id] || {}
            
            return (
              <div key={habit.id} className="space-y-3 p-5 rounded-2xl border bg-card shadow-sm">
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
                      <p className="text-xs text-muted-foreground">{habit.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Current</span>
                      <span className="font-bold text-lg leading-none">{habit.currentStreak}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Longest</span>
                      <span className="font-bold text-lg leading-none">{habit.longestStreak}</span>
                    </div>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div 
                    ref={el => { scrollRefs.current[index] = el }}
                    className={cn(
                      "overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth",
                      mode !== "yearly" && "overflow-x-hidden"
                    )}
                  >
                    <HeatmapGrid 
                      habit={habit} 
                      mode={mode} 
                      weeks={weeks} 
                      logs={habitLogs} 
                      monthLabels={monthLabels} 
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
