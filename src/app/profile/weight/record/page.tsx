import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WeightRecordFormWrapper } from "@/features/weight/components/weight-record-form-wrapper"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RecordWeightPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <PageShell>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Link href="/profile/weight">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span>Record Weight</span>
          </div>
        }
      />
      <div className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-6">
        <div className="bg-card rounded-xl border p-4 shadow-sm sm:p-6">
          <WeightRecordFormWrapper />
        </div>
      </div>
    </PageShell>
  )
}
