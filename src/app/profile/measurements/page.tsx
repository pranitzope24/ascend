import { MeasurementTrackerView } from "@/features/measurements/components/measurement-tracker-view"
import { getMeasurementLogs } from "@/features/measurements/actions"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Body Measurements | Ascend",
}

export default async function MeasurementsPage() {
  const logs = await getMeasurementLogs()

  const serializedLogs = logs.map((log: any) => ({
    ...log,
    date: log.date.toISOString(),
    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  }))

  return (
    <PageShell>
      <PageHeader 
        title="Measurements" 
        actions={
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        } 
      />
      <div className="flex-1 overflow-y-auto">
        <MeasurementTrackerView initialLogs={serializedLogs as any} />
      </div>
    </PageShell>
  )
}
