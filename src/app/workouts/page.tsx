import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { WorkoutDashboard } from "@/features/workouts/components/workout-dashboard"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { WorkoutActions } from "@/features/workouts/components/workout-actions"

export default function WorkoutsPage() {
  return (
    <PageShell>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Workouts</span>
          </div>
        }
        description="Track and manage your fitness routines."
        actions={<WorkoutActions />}
      />
      <div className="flex-1 p-4 pb-24">
        <WorkoutDashboard />
      </div>
    </PageShell>
  )
}
