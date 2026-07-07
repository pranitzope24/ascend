import { Mountain, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HabitEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mountain className="size-10" />
      </div>
      <h2 className="text-xl font-semibold">Your next climb starts here</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create a habit to begin shaping the routines that move you forward.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus data-icon="inline-start" /> Create your first habit
      </Button>
    </div>
  )
}
