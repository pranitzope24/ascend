import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getProfileStats } from "@/features/profile/services/profile"
import { ProfileView } from "@/features/profile/components/profile-view"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const data = await getProfileStats(session.user.id)
  if (!data) {
    redirect("/login")
  }

  return (
    <PageShell>
      <PageHeader 
        title={
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Profile</span>
          </div>
        } 
      />
      <ProfileView data={data} />
    </PageShell>
  )
}
