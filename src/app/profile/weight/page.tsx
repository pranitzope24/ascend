import { WeightTrackerView } from "@/features/weight/components/weight-tracker-view"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function WeightTrackerPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return <WeightTrackerView />
}
