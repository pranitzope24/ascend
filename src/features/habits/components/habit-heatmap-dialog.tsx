"use client"

import { useEffect, useState, useRef } from "react"
import { Flame, Loader2 } from "lucide-react"

import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { getHabitLogs } from "@/features/habits/services/habit-service"
import { HeatmapGrid } from "@/features/habits/components/heatmap-grid"
import type { Habit, HabitLog } from "@/features/habits/types"
import { cn } from "@/lib/utils"

interface HabitHeatmapDialogProps {
  habit: Habit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ViewMode = "weekly" | "monthly" | "yearly"

export function HabitHeatmapDialog({ habit, open, onOpenChange }: HabitHeatmapDialogProps) {
  const [logs, setLogs] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<ViewMode>("weekly")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && habit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true)
      getHabitLogs(habit.id)
        .then((data: HabitLog[]) => {
          const logMap = data.reduce((acc, log) => {
            acc[log.date] = log.completed
            return acc
          }, {} as Record<string, boolean>)
          setLogs(logMap)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open, habit])

  useEffect(() => {
    if (!loading && open && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [loading, open, mode])

  if (!habit) return null

  const weeksCount = mode === "yearly" ? 52 : mode === "monthly" ? 4 : 1

  // Generate weeks of history up to today
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
      
      // Track months for labels
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
    <ResponsiveDialog
      description={`Historical completions for ${habit.title}`}
      onOpenChange={onOpenChange}
      open={open}
      title={
        <div className="flex items-center gap-3">
          <div 
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          >
            <Flame className="size-5" />
          </div>
          <span>{habit.title} History</span>
        </div>
      }
      className="md:max-w-3xl"
    >
      <div className="py-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Current Streak</span>
              <span className="text-xl font-bold">{habit.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Longest Streak</span>
              <span className="text-xl font-bold">{habit.longestStreak} <span className="text-sm font-normal text-muted-foreground">days</span></span>
            </div>
          </div>
          
          <div className="flex bg-muted/50 p-1 rounded-lg">
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
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="relative">
            {/* Scrollable Heatmap Container */}
            <div 
              ref={scrollRef}
              className={cn(
                "overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth",
                mode !== "yearly" && "overflow-x-hidden"
              )}
            >
              <HeatmapGrid 
                habit={habit} 
                mode={mode} 
                weeks={weeks} 
                logs={logs} 
                monthLabels={monthLabels} 
              />
            </div>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  )
}
