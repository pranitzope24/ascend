"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { WorkoutDetails } from "@/features/workouts/components/workout-details"
import { getSessionById } from "@/features/workouts/services/workout-service"
import type { WorkoutSession } from "@/features/workouts/types"
import { Button } from "@/components/ui/button"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import { getSessionTemplateLabel } from "@/features/workouts/utils/session-label"

export default function HistoryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { templates, loadTemplates } = useWorkoutTemplateStore()

  useEffect(() => {
    async function load() {
      await loadTemplates()
      if (typeof params.id === "string") {
        const data = await getSessionById(params.id)
        if (data) {
          setSession(data)
        }
      }
      setIsLoading(false)
    }
    load()
  }, [loadTemplates, params.id])

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader
          title="Workout Details"
          actions={
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          }
        />
        <div className="text-muted-foreground flex-1 p-8 text-center">Loading...</div>
      </PageShell>
    )
  }

  if (!session) {
    return (
      <PageShell>
        <PageHeader
          title="Not Found"
          actions={
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          }
        />
        <div className="flex-1 p-8 text-center">
          <p className="text-muted-foreground mb-4">Workout session not found.</p>
          <Button onClick={() => router.push("/workouts/history")}>Back to History</Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Workout Details"
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        }
      />
      <div className="mx-auto w-full max-w-2xl flex-1 p-4 pb-24">
        <WorkoutDetails
          session={session}
          templateLabel={getSessionTemplateLabel(session, templates)}
        />
      </div>
    </PageShell>
  )
}
