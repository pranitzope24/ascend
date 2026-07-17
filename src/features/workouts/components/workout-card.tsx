import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WorkoutSession } from "@/features/workouts/types"
import { useWorkoutStore } from "@/store/workout-store"
import { format } from "date-fns"
import { MoreVertical, Trash } from "lucide-react"

interface WorkoutCardProps {
  session: WorkoutSession
  onClick?: (session: WorkoutSession) => void
}

export function WorkoutCard({ session, onClick }: WorkoutCardProps) {
  const { deleteSession } = useWorkoutStore()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this workout?")) {
      await deleteSession(session.id)
    }
  }

  return (
    <div
      className={`bg-card text-card-foreground ring-foreground/10 flex w-full flex-row items-center justify-between rounded-2xl border p-4 ring-1 ${onClick ? "hover:bg-muted/50 cursor-pointer transition-colors" : ""}`}
      onClick={() => onClick?.(session)}
    >
      <div className="flex flex-col gap-1 text-left">
        <span className="text-sm font-medium">{session.name}</span>
        <span className="text-muted-foreground text-xs">
          {format(session.startedAt, "MMM d, h:mm a")}
          {session.duration ? ` • ${Math.round(session.duration / 60)} min` : ""}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
