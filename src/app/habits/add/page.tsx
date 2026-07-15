import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { HabitForm } from "@/features/habits/components/habit-form"

export default function AddHabitPage() {
  return (
    <PageShell>
      <PageHeader
        description="Choose a clear action you want to repeat."
        title="Create a habit"
      />
      <div className="mt-8">
        <HabitForm />
      </div>
    </PageShell>
  )
}
