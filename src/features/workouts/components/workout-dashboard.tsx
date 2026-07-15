"use client"

import { useEffect } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { Button } from "@/components/ui/button"
import { startOfDay, endOfDay } from "date-fns"
import { useRouter } from "next/navigation"
import { WeeklyMuscleCard } from "./weekly-muscle-card"
import { WorkoutCard } from "./workout-card"

export function WorkoutDashboard() {
  const router = useRouter()
  const { 
    sessions, 
    todayMuscleIntensities,
    thisWeekMuscleIntensities, 
    loadSessions, 
    loadAnalytics,
    activeSessionId,
    startWorkout
  } = useWorkoutStore()

  useEffect(() => {
    loadSessions()
    loadAnalytics()
  }, [loadSessions, loadAnalytics])

  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  const todaysSessions = sessions.filter(
    (s) => s.startedAt >= todayStart && s.startedAt <= todayEnd
  )

  const handleStartWorkout = () => {
    if (!activeSessionId) {
      startWorkout()
    }
    router.push("/workouts/log")
  }

  return (
    <div className="flex flex-col gap-6">
      {activeSessionId && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Workout in Progress</h3>
            <p className="text-xs text-muted-foreground">You have an active session.</p>
          </div>
          <Button size="sm" onClick={handleStartWorkout}>
            Resume
          </Button>
        </div>
      )}

      <WeeklyMuscleCard dailyIntensities={todayMuscleIntensities} weeklyIntensities={thisWeekMuscleIntensities} />

      {/* Quick Stats / Recent */}
      {sessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg px-1">Recent Sessions</h3>
          <div className="flex flex-col gap-3">
            {sessions.slice(0, 3).map((session) => (
              <WorkoutCard key={session.id} session={session} onClick={() => router.push(`/workouts/history`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
