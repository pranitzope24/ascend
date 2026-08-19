"use client"

import { useState, useEffect } from "react"
import { useMacroStore } from "@/store/macro-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Flame, Beef, ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

export function WeeklyMacroTracker() {
  const { fetchLogs, bulkUpsertLogs, getLogForDate } = useMacroStore()
  
  // Track the currently viewed week's starting date (Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  // Local state for the 7 days of the week
  // Stored as an array of objects: { date, calories, protein, isDirty }
  const [weekData, setWeekData] = useState<{ date: Date; calories: string; protein: string; isDirty: boolean }[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Fetch all logs on mount
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Populate weekData when the selected week or the store's logs change
  useEffect(() => {
    const newWeekData = []
    for (let i = 0; i < 7; i++) {
      const day = addDays(currentWeekStart, i)
      const existingLog = getLogForDate(day)
      newWeekData.push({
        date: day,
        calories: existingLog ? existingLog.calories.toString() : "",
        protein: existingLog ? existingLog.protein.toString() : "",
        isDirty: false,
      })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeekData(newWeekData)
  }, [currentWeekStart, getLogForDate])

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1))
  }

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1))
  }

  const handleInputChange = (index: number, field: "calories" | "protein", value: string) => {
    const newData = [...weekData]
    newData[index] = {
      ...newData[index],
      [field]: value,
      isDirty: true, // Mark this day as edited
    }
    setWeekData(newData)
  }

  const handleSave = async () => {
    // Collect all dirty (edited) records
    const dirtyRecords = weekData.filter(d => d.isDirty)
    
    if (dirtyRecords.length === 0) return

    const logsToUpsert = dirtyRecords.map(record => ({
      date: record.date,
      calories: parseInt(record.calories, 10) || 0,
      protein: parseInt(record.protein, 10) || 0,
    }))

    setIsSaving(true)
    try {
      await bulkUpsertLogs(logsToUpsert)
      // Reset isDirty flags
      setWeekData(prev => prev.map(d => ({ ...d, isDirty: false })))
    } catch (error) {
      console.error("Failed to save macros")
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = weekData.some(d => d.isDirty)

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between rounded-xl bg-card p-3 shadow-sm border">
        <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <div className="font-semibold text-sm">
            {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNextWeek} disabled={currentWeekStart >= startOfWeek(new Date(), { weekStartsOn: 1 })}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Week Grid */}
      <div className="space-y-3">
        {weekData.map((dayData, index) => {
          const isToday = isSameDay(dayData.date, new Date())
          
          return (
            <div 
              key={index} 
              className={cn(
                "rounded-2xl border bg-card p-4 shadow-sm transition-colors",
                isToday && "border-primary/50 bg-primary/5"
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={cn("text-sm font-semibold", isToday ? "text-primary" : "text-foreground")}>
                  {format(dayData.date, "EEEE")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(dayData.date, "MMM d")}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-orange-500">
                    <Flame className="h-3.5 w-3.5" /> Calories
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={dayData.calories}
                      onChange={(e) => handleInputChange(index, "calories", e.target.value)}
                      className={cn("h-9 shadow-none pr-8", dayData.isDirty && "border-orange-200 bg-orange-50/30 dark:border-orange-900 dark:bg-orange-900/10")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      kcal
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-500">
                    <Beef className="h-3.5 w-3.5" /> Protein
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={dayData.protein}
                      onChange={(e) => handleInputChange(index, "protein", e.target.value)}
                      className={cn("h-9 shadow-none pr-6", dayData.isDirty && "border-blue-200 bg-blue-50/30 dark:border-blue-900 dark:bg-blue-900/10")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 pt-2 pb-[env(safe-area-inset-bottom)]">
        <Button 
          className="w-full h-12 rounded-xl text-md font-semibold shadow-md"
          disabled={!hasChanges || isSaving}
          onClick={handleSave}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
