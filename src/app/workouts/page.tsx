import { PageShell, PageHeader } from "@/components/shared/page-shell"

export default function WorkoutsPage() {
  return (
    <PageShell>
      <PageHeader title="Workouts" description="Track and manage your fitness routines." />
      <div className="flex-1 p-6">
        <p className="text-muted-foreground text-sm">Workouts implementation coming soon.</p>
      </div>
    </PageShell>
  )
}
