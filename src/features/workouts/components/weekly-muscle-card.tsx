import { BodyHeatmap } from "./body-heatmap"

interface MuscleCardProps {
  intensities: { slug: string; intensity: number }[]
  view: "daily" | "weekly"
}

export function WeeklyMuscleCard({ intensities, view }: MuscleCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="w-full">
        {intensities.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No workouts {view === "daily" ? "today" : "this week"}.
          </div>
        ) : (
          <BodyHeatmap data={intensities} />
        )}
      </div>
    </div>
  )
}
