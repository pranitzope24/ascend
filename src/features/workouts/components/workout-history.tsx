"use client"

import { useEffect } from "react"
import { useWorkoutStore } from "@/store/workout-store"
import { WorkoutCard } from "./workout-card"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export function WorkoutHistory() {
  const { sessions, loadSessions, isLoading } = useWorkoutStore()
  const router = useRouter()

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  if (isLoading) {
    return <div className="text-muted-foreground p-8 text-center">Loading history...</div>
  }

  if (sessions.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">No workouts completed yet.</p>
      </div>
    )
  }

  // Group by month
  const grouped: Record<string, typeof sessions> = {}
  for (const session of sessions) {
    const month = format(session.startedAt, "MMMM yyyy")
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(session)
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([month, monthSessions]) => (
        <div key={month} className="space-y-4">
          <h3 className="bg-background/90 sticky top-14 z-10 px-1 py-2 text-lg font-semibold backdrop-blur-sm">
            {month}
          </h3>
          <div className="flex flex-col gap-3">
            {monthSessions.map((session) => (
              <WorkoutCard
                key={session.id}
                session={session}
                onClick={() => router.push(`/workouts/history/${session.id}`)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
