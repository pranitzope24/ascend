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
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span>Record Weight</span>
          </div>
        }
      />
      <div className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="border rounded-xl bg-card p-4 sm:p-6 shadow-sm">
          <WeightRecordFormWrapper />
        </div>
      </div>
    </PageShell>
  )
}
