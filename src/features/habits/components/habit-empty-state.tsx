import { Mountain, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HabitEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-muted/20 flex min-h-[min(24rem,60dvh)] flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center sm:rounded-3xl sm:px-6">
      <div className="bg-primary/10 text-primary mb-5 flex size-16 items-center justify-center rounded-full sm:size-20">
        <Mountain className="size-8 sm:size-10" />
      </div>
      <h2 className="text-xl font-semibold">Your next climb starts here</h2>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        Create a habit to begin shaping the routines that move you forward.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus data-icon="inline-start" /> Create your first habit
      </Button>
    </div>
  )
}
