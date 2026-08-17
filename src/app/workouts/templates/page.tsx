import Link from "next/link"
import { Plus } from "lucide-react"

import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { WorkoutTemplatesView } from "@/features/workouts/components/workout-templates-view"

export default function WorkoutTemplatesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Templates"
        description="Create, edit, and start reusable workout routines."
        actions={
          <Button asChild size="sm">
            <Link href="/workouts/templates/add">
              <Plus className="mr-2 size-4" />
              New Template
            </Link>
          </Button>
        }
      />
      <div className="flex-1 p-4 pb-24">
        <WorkoutTemplatesView />
      </div>
    </PageShell>
  )
}

