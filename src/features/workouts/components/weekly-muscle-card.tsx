import { useState } from "react";
import { BodyHeatmap } from "./body-heatmap";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MuscleCardProps {
  dailyIntensities: { slug: string; intensity: number }[]
  weeklyIntensities: { slug: string; intensity: number }[]
}

export function WeeklyMuscleCard({ dailyIntensities, weeklyIntensities }: MuscleCardProps) {
  const [view, setView] = useState<"daily" | "weekly">("weekly")

  const intensities = view === "daily" ? dailyIntensities : weeklyIntensities

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <Tabs value={view} onValueChange={(v) => setView(v as "daily" | "weekly")}>
        <TabsList className="grid w-32 grid-cols-2 h-8">
          <TabsTrigger value="daily" className="text-xs">Day</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">Week</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="w-full">
        {intensities.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No workouts {view === "daily" ? "today" : "this week"}.
          </div>
        ) : (
          <BodyHeatmap data={intensities} />
        )}
      </div>
    </div>
  )
}
