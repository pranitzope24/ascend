import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { WeeklyMacroTracker } from "@/features/macros/components/weekly-macro-tracker"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function MacroTrackerPage() {
  return (
    <PageShell>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Link href="/profile" className="mr-1 inline-flex p-1">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <span>Macro Tracker</span>
          </div>
        }
        description="View and edit your weekly macro history."
      />

      <div className="mt-6">
        <WeeklyMacroTracker />
      </div>
    </PageShell>
  )
}
