import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { WorkoutHistory } from "@/features/workouts/components/workout-history"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  return (
    <PageShell>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground -ml-3"
        >
          <Link href="/workouts">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Workouts
          </Link>
        </Button>
      </div>
      <PageHeader title="History" description="Your past workout sessions." />
      <div className="flex-1 p-4 pb-24">
        <WorkoutHistory />
      </div>
    </PageShell>
  )
}
