import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { WorkoutSession } from "@/features/workouts/types"
import { format } from "date-fns"

interface WorkoutDetailsProps {
  session: WorkoutSession
}

export function WorkoutDetails({ session }: WorkoutDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 py-4 text-center">
        <h2 className="text-2xl font-bold">{session.name}</h2>
        <p className="text-muted-foreground">
          {format(session.startedAt, "EEEE, MMMM d, yyyy 'at' h:mm a")}
        </p>
        {session.duration && (
          <p className="text-sm font-medium">Duration: {Math.round(session.duration / 60)} min</p>
        )}
      </div>

      {session.notes && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {session.exerciseSnapshots.map((exercise) => {
          const completedSets = exercise.sets.filter((s) => s.completed)

          if (completedSets.length === 0) return null // Hide skipped exercises

          return (
            <Card key={exercise.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-primary text-lg">{exercise.exerciseName}</CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="text-muted-foreground bg-muted/30 grid grid-cols-[3rem_1fr_1fr] gap-2 border-y px-3 py-2 text-xs font-semibold tracking-wider uppercase">
                  <div className="text-center">Set</div>
                  <div className="text-center">kg</div>
                  <div className="text-center">Reps</div>
                </div>

                <div className="bg-muted/10 flex flex-col gap-[1px]">
                  {completedSets.map((set, index) => (
                    <div
                      key={set.id}
                      className="bg-background grid grid-cols-[3rem_1fr_1fr] items-center gap-2 px-3 py-2"
                    >
                      <div className="text-muted-foreground text-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="text-center font-medium">{set.weight || "-"}</div>
                      <div className="text-center font-medium">{set.reps || "-"}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
