import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { WorkoutTemplateForm } from "@/features/workouts/components/workout-template-form"

export default function AddWorkoutTemplatePage() {
  return (
    <PageShell>
      <PageHeader
        description="Create a reusable workout routine."
        title="New Template"
      />
      <div className="mt-8">
        <WorkoutTemplateForm />
      </div>
    </PageShell>
  )
}
