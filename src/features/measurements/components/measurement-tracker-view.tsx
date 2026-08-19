"use client"

import { useEffect, useState, useMemo } from "react"
import { useMeasurementStore } from "@/store/measurement-store"
import { BodyMeasurementLog } from "@/features/measurements/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MeasurementFigurine } from "./measurement-figurine"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export function MeasurementTrackerView({ initialLogs }: { initialLogs: BodyMeasurementLog[] }) {
  const { logs, fetchLogs, deleteLog, isLoading } = useMeasurementStore()
  const displayLogs = logs.length > 0 ? logs : initialLogs

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Get unique dates for the visualizer timeline
  const uniqueDates = useMemo(() => {
    const dates = new Set(displayLogs.map((log) => format(new Date(log.date), "yyyy-MM-dd")))
    return Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }, [displayLogs])

  const [currentDateIndex, setCurrentDateIndex] = useState(0)
  
  // Format measurements for the figurine based on the currently selected date
  const measurementsForFigurine = useMemo(() => {
    if (uniqueDates.length === 0) return {}
    const currentDate = uniqueDates[currentDateIndex]
    
    // In a real app, we might want to carry over previous measurements if they weren't taken on this date.
    // For simplicity, we only show measurements taken on the selected date.
    const logsForDate = displayLogs.filter((log) => format(new Date(log.date), "yyyy-MM-dd") === currentDate)
    
    const formatted: Record<string, string> = {}
    logsForDate.forEach((log) => {
      const key = log.side ? `${log.part}-${log.side}` : log.part
      formatted[key] = `${log.value} ${log.unit}`
    })
    return formatted
  }, [displayLogs, uniqueDates, currentDateIndex])

  const handlePrevDate = () => {
    if (currentDateIndex < uniqueDates.length - 1) {
      setCurrentDateIndex(currentDateIndex + 1)
    }
  }

  const handleNextDate = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1)
    }
  }

  return (
    <div className="flex flex-col space-y-6 pb-20">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-2xl font-bold">Body Measurements</h1>
        <Link href="/profile/measurements/record">
          <Button size="icon" className="h-10 w-10 rounded-full shadow-md">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="visual" className="w-full">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visualizer</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="mt-6 px-4">
          {uniqueDates.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border bg-card p-2 shadow-sm">
                <Button variant="ghost" size="icon" onClick={handlePrevDate} disabled={currentDateIndex === uniqueDates.length - 1}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-center">
                  <p className="font-semibold">{format(parseISO(uniqueDates[currentDateIndex]), "MMMM d, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">Snapshot</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextDate} disabled={currentDateIndex === 0}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="rounded-2xl border bg-card py-8 shadow-sm">
                <MeasurementFigurine measurements={measurementsForFigurine} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center shadow-sm">
              <p className="mb-2 font-medium text-muted-foreground">No measurements recorded yet.</p>
              <Link href="/profile/measurements/record">
                <Button variant="outline" className="mt-4">Record your first</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6 px-4">
          <div className="space-y-4">
            {displayLogs.length > 0 ? (
              displayLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{log.part} {log.side ? `(${log.side})` : ""}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(log.date), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lg text-primary">{log.value} <span className="text-sm font-normal text-muted-foreground">{log.unit}</span></span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteLog(log.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No history available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
