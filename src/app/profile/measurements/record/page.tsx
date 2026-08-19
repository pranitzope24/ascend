import { MeasurementRecordForm } from "@/features/measurements/components/measurement-record-form"
import { PageHeader, PageShell } from "@/components/shared/page-shell"

export const metadata = {
  title: "Record Measurement | Ascend",
}

export default function RecordMeasurementPage() {
  return (
    <PageShell>
      <PageHeader title="Record Measurement" />
      <div className="flex-1 overflow-y-auto">
        <MeasurementRecordForm />
      </div>
    </PageShell>
  )
}
