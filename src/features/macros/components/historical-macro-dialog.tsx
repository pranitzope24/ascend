"use client"

import { useState, useEffect } from "react"
import { useMacroStore } from "@/store/macro-store"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Flame, Beef, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface HistoricalMacroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoricalMacroDialog({ open, onOpenChange }: HistoricalMacroDialogProps) {
  const { upsertLog, getLogForDate } = useMacroStore()
  
  const [date, setDate] = useState<Date>(new Date())
  const [calories, setCalories] = useState<string>("")
  const [protein, setProtein] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Populate data when date changes
  useEffect(() => {
    const existingLog = getLogForDate(date)
    if (existingLog) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCalories(existingLog.calories.toString())
       
      setProtein(existingLog.protein.toString())
    } else {
       
      setCalories("")
       
      setProtein("")
    }
  }, [date, getLogForDate])

  const handleSave = async () => {
    const cal = parseInt(calories, 10) || 0
    const pro = parseInt(protein, 10) || 0
    
    if (cal === 0 && pro === 0) return

    setIsSaving(true)
    try {
      await upsertLog({
        date,
        calories: cal,
        protein: pro,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Historical Macros"
      description="Record or edit macros for a specific past date."
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || (calories === "" && protein === "")}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pt-2 pb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto origin-top-left scale-90 p-0 sm:scale-100"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate)
                    setCalendarOpen(false)
                  }
                }}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium leading-none text-orange-500">
            <Flame className="h-4 w-4" /> Calories
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="e.g. 2000"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="h-10 text-lg shadow-none"
            />
            <span className="text-sm font-medium text-muted-foreground">kcal</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium leading-none text-blue-500">
            <Beef className="h-4 w-4" /> Protein
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="e.g. 150"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="h-10 text-lg shadow-none"
            />
            <span className="text-sm font-medium text-muted-foreground">g</span>
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  )
}
