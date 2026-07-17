"use client"

import { useEffect, useState } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { Button } from "@/components/ui/button"
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns"
import { useRouter } from "next/navigation"
import { WeeklyMuscleCard } from "./weekly-muscle-card"
import { WorkoutCard } from "./workout-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { computeIntensitiesForSessions } from "../utils/analytics"

type ViewMode = "daily" | "weekly"

export function WorkoutDashboard() {
  const router = useRouter()
  const {
    sessions,
    todayMuscleIntensities,
    thisWeekMuscleIntensities,
    loadSessions,
    loadAnalytics,
    activeSessionId,
    startWorkout,
  } = useWorkoutStore()

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const [mode, setMode] = useState<ViewMode>("weekly")
  const [offsetCounter, setOffsetCounter] = useState(0)

  const today = new Date()
  const baseDate = new Date(today)

  if (mode === "daily") {
    baseDate.setDate(baseDate.getDate() + offsetCounter)
  } else if (mode === "weekly") {
    baseDate.setDate(baseDate.getDate() + offsetCounter * 7)
  }

  let startDate: Date
  let endDate: Date

  if (mode === "daily") {
    startDate = startOfDay(baseDate)
    endDate = endOfDay(baseDate)
  } else {
    startDate = startOfWeek(baseDate, { weekStartsOn: 1 })
    endDate = endOfWeek(baseDate, { weekStartsOn: 1 })
  }

  const filteredSessions = sessions
    .filter((s) => new Date(s.startedAt) >= startDate && new Date(s.startedAt) <= endDate)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  const intensities = computeIntensitiesForSessions(filteredSessions)

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })
  const dateRangeLabel =
    mode === "daily" ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`

  const handleStartWorkout = () => {
    if (!activeSessionId) {
      startWorkout()
    }
    router.push("/workouts/log")
  }

  return (
    <div className="flex flex-col gap-6">
      {activeSessionId && (
        <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-xl border p-4">
          <div>
            <h3 className="text-sm font-semibold">Workout in Progress</h3>
            <p className="text-muted-foreground text-xs">You have an active session.</p>
          </div>
          <Button size="sm" onClick={handleStartWorkout}>
            Resume
          </Button>
        </div>
      )}

      <div className="bg-card mt-2 flex w-fit items-center justify-between self-center rounded-xl border p-1 shadow-sm">
        {(["daily", "weekly"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition-colors",
              mode === m
                ? "bg-background border shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => {
              setMode(m)
              setOffsetCounter(0)
            }}
          >
            {m === "daily" ? "Day" : "Week"}
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
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

      <WeeklyMuscleCard intensities={intensities} view={mode} />

      {/* Quick Stats / Recent */}
      <div className="space-y-4">
        <h3 className="px-1 text-lg font-semibold">
          {mode === "daily" ? "Sessions this day" : "Sessions this week"}
        </h3>
        {filteredSessions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredSessions.map((session) => (
              <WorkoutCard
                key={session.id}
                session={session}
                onClick={() => router.push(`/workouts/history`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground px-1 text-sm">
            No sessions logged for this timeframe.
          </div>
        )}
      </div>
    </div>
  )
}
