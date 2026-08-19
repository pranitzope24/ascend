"use client"

import { useState, useEffect } from "react"
import { useMacroStore } from "@/store/macro-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Flame, Beef, History } from "lucide-react"
import { HistoricalMacroDialog } from "./historical-macro-dialog"
import { cn } from "@/lib/utils"

export function DashboardMacroCard() {
  const { getLogForDate, upsertLog, fetchLogs } = useMacroStore()
  const today = new Date()
  
  // Local state for immediate input feedback
  const [calories, setCalories] = useState<string>("")
  const [protein, setProtein] = useState<string>("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch all logs on mount to populate today's data if it exists
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const todaysLog = getLogForDate(today)

  useEffect(() => {
    if (todaysLog) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCalories(todaysLog.calories.toString())
       
      setProtein(todaysLog.protein.toString())
    }
  }, [todaysLog])

  const handleSave = async () => {
    const cal = parseInt(calories, 10) || 0
    const pro = parseInt(protein, 10) || 0
    
    if (cal === 0 && pro === 0) return

    setIsSaving(true)
    try {
      await upsertLog({
        date: today,
        calories: cal,
        protein: pro,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Today&apos;s Macros</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-muted-foreground"
            onClick={() => setIsHistoryOpen(true)}
          >
            <History className="mr-1.5 h-4 w-4" />
            History
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-orange-500">
              <Flame className="h-4 w-4" />
              <span>Calories</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                onBlur={handleSave}
                className={cn(
                  "h-10 text-lg font-semibold shadow-none transition-colors",
                  todaysLog && "bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">kcal</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-blue-500">
              <Beef className="h-4 w-4" />
              <span>Protein</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                onBlur={handleSave}
                className={cn(
                  "h-10 text-lg font-semibold shadow-none transition-colors",
                  todaysLog && "bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">g</span>
            </div>
          </div>
        </div>
      </div>

      <HistoricalMacroDialog 
        open={isHistoryOpen} 
        onOpenChange={setIsHistoryOpen} 
      />
    </>
  )
}
