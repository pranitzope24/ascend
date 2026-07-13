import { PageShell, PageHeader } from "@/components/shared/page-shell"

export default function ProfilePage() {
  return (
    <PageShell>
      <PageHeader title="Profile" description="Manage your account and settings." />
      <div className="flex-1 p-6">
        <p className="text-muted-foreground text-sm">Profile implementation coming soon.</p>
      </div>
    </PageShell>
  )
}
