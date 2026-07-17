"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { WorkoutTemplateForm } from "@/features/workouts/components/workout-template-form"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"

export default function EditWorkoutTemplatePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const templates = useWorkoutTemplateStore((state) => state.templates)
  const loadTemplates = useWorkoutTemplateStore((state) => state.loadTemplates)

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    void loadTemplates().then(() => setIsLoaded(true))
  }, [loadTemplates])

  if (!isLoaded) return null

  const template = templates.find((t) => t.id === id)

  if (!template) {
    router.replace("/workouts/templates")
    return null
  }

  return (
    <PageShell>
      <PageHeader description="Update your workout template details." title="Edit Template" />
      <div className="mt-8">
        <WorkoutTemplateForm template={template} />
      </div>
    </PageShell>
  )
}
