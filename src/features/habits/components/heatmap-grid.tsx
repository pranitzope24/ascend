import { Check } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Habit } from "@/features/habits/types"

interface HeatmapGridProps {
  habit: Habit
  mode: "weekly" | "monthly" | "yearly"
  weeks: { date: string; isFuture: boolean; dayOfWeek: number }[][]
  logs: Record<string, boolean>
  monthLabels: { label: string; index: number }[]
}

const DAY_LABELS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

export function HeatmapGrid({ habit, mode, weeks, logs, monthLabels }: HeatmapGridProps) {
  if (mode === "yearly") {
    // GitHub style heatmap
    return (
      <div className="inline-flex min-w-full flex-col gap-1.5 pt-4">
        {/* Month Labels */}
        <div className="relative h-4 w-full">
          {monthLabels.map((m, i) => (
            <div 
              key={i} 
              className="absolute text-[10px] font-medium text-muted-foreground"
              style={{ left: `${m.index * 14}px` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="grid grid-rows-7 gap-1">
              {week.map((day, dIndex) => {
                const isCompleted = logs[day.date]
                return (
                  <Tooltip key={dIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "size-[10px] rounded-[2px] transition-colors",
                          day.isFuture ? "opacity-0" : ""
                        )}
                        style={{
                          backgroundColor: isCompleted 
                            ? habit.color 
                            : "var(--color-muted, #f1f5f9)",
                          opacity: isCompleted ? 1 : (day.isFuture ? 0 : 0.4)
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {day.date}{isCompleted ? " - Completed" : ""}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Weekly or Monthly mode (Calendar style)
  const allDays = weeks.flat()
  
  return (
    <div className="pt-2">
      <div className="grid grid-cols-7 gap-x-2 gap-y-3 sm:gap-x-3">
        {/* Header row for days */}
        {mode === "weekly" && DAY_LABELS.map((dayLabel, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground tracking-wider">
            {dayLabel}
          </div>
        ))}
        {mode === "monthly" && DAY_LABELS.map((dayLabel, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground tracking-wider">
            {dayLabel}
          </div>
        ))}

        {/* Calendar Grid */}
        {allDays.map((day, dIndex) => {
          const isCompleted = logs[day.date]
          return (
            <Tooltip key={dIndex}>
              <TooltipTrigger asChild>
                <div className={cn("flex flex-col items-center gap-1.5 cursor-default", day.isFuture ? "opacity-30" : "")}>
                  <div
                    className={cn(
                      "flex size-8 sm:size-10 items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all",
                      isCompleted ? "border-transparent" : "border-muted-foreground/20 bg-transparent"
                    )}
                    style={{
                      backgroundColor: isCompleted ? habit.color : undefined,
                      color: isCompleted ? "#fff" : undefined,
                    }}
                  >
                    {isCompleted && <Check className="size-4 sm:size-5 stroke-[3] animate-in zoom-in duration-200" />}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {day.date}{isCompleted ? " - Completed" : ""}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
