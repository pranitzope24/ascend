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
    return <div className="p-8 text-center text-muted-foreground">Loading history...</div>
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
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
          <h3 className="font-semibold text-lg px-1 sticky top-14 bg-background/90 py-2 backdrop-blur-sm z-10">
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
