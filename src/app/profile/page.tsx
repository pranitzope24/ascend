import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"
import { LogOut } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function ProfilePage() {
  return (
    <PageShell>
      <PageHeader 
        title={
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Profile</span>
          </div>
        } 
        description="Manage your account and settings." 
        actions={
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <Button type="submit" variant="destructive">
              <LogOut data-icon="inline-start" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </form>
        }
      />
      <div className="flex-1 p-6">
        <p className="text-muted-foreground text-sm">Profile implementation coming soon.</p>
      </div>
    </PageShell>
  )
}
