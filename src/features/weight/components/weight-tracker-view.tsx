"use client"

import { useEffect, useState, useMemo } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { useWeightStore, type BodyWeightLog, type TimeRange } from "@/store/weight-store"
import { WeightChart } from "./weight-chart"
import { WeightLogCard } from "./weight-log-card"
import { subDays, isAfter, parseISO } from "date-fns"
import { useRouter } from "next/navigation"

export function WeightTrackerView() {
  const { logs, isLoading, timeRange, setTimeRange, fetchLogs } = useWeightStore()
  const router = useRouter()

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleEdit = (log: BodyWeightLog) => {
    router.push(`/profile/weight/record?edit=${log.id}`)
  }

  const handleAdd = () => {
    router.push("/profile/weight/record")
  }

  // Sort logs by newest first for the list
  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    )
  }, [logs])

  // Statistics calculation
  const stats = useMemo(() => {
    if (logs.length === 0) {
      return { current: "-", change30: "-", highest: "-", lowest: "-" }
    }

    const currentWeight = sortedLogs[0].weight

    const thirtyDaysAgo = subDays(new Date(), 30)

    const last30DaysLogs = sortedLogs.filter((log) =>
      isAfter(parseISO(log.recordedAt), thirtyDaysAgo)
    )
    let log30DaysAgo: BodyWeightLog | undefined
    if (last30DaysLogs.length > 0) {
      log30DaysAgo = last30DaysLogs[last30DaysLogs.length - 1]
    }

    const change30 = log30DaysAgo ? currentWeight - log30DaysAgo.weight : null

    const weights = logs.map((l) => l.weight)
    const highest = Math.max(...weights)
    const lowest = Math.min(...weights)

    return {
      current: `${Number(currentWeight).toFixed(2)} kg`,
      change30:
        change30 !== null ? `${change30 > 0 ? "+" : ""}${Number(change30).toFixed(2)} kg` : "-",
      highest: `${Number(highest).toFixed(2)} kg`,
      lowest: `${Number(lowest).toFixed(2)} kg`,
    }
  }, [logs, sortedLogs])

  const timeRanges: TimeRange[] = ["1M", "3M", "6M", "1Y", "ALL"]

  return (
    <PageShell>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span>Weight Tracker</span>
          </div>
        }
        actions={
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Record Weight</span>
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-4 md:p-6">
        {/* Current Weight Card */}
        <div className="bg-card flex flex-col gap-1 rounded-xl border p-6 text-center">
          <h3 className="text-muted-foreground font-medium">Current Weight</h3>
          {logs.length > 0 ? (
            <>
              <div className="text-4xl font-bold tracking-tight">{stats.current}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                Updated{" "}
                {sortedLogs[0].recordedAt.split("T")[0] === new Date().toISOString().split("T")[0]
                  ? "Today"
                  : "Recently"}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg font-medium">No weight recorded yet.</p>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex scrollbar-none justify-center gap-2 overflow-x-auto pb-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="h-8 rounded-full px-4"
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-card rounded-xl border p-4">
          <WeightChart logs={logs} />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card flex flex-col gap-1 rounded-xl border p-4">
            <span className="text-muted-foreground text-sm font-medium">Current Weight</span>
            <span className="text-xl font-bold">{stats.current}</span>
          </div>
          <div className="bg-card flex flex-col gap-1 rounded-xl border p-4">
            <span className="text-muted-foreground text-sm font-medium">30 Day Change</span>
            <span
              className={`text-xl font-bold ${stats.change30.startsWith("+") ? "text-red-500" : stats.change30.startsWith("-") && stats.change30 !== "-" ? "text-green-500" : ""}`}
            >
              {stats.change30}
            </span>
          </div>
          <div className="bg-card flex flex-col gap-1 rounded-xl border p-4">
            <span className="text-muted-foreground text-sm font-medium">Highest Recorded</span>
            <span className="text-xl font-bold">{stats.highest}</span>
          </div>
          <div className="bg-card flex flex-col gap-1 rounded-xl border p-4">
            <span className="text-muted-foreground text-sm font-medium">Lowest Recorded</span>
            <span className="text-xl font-bold">{stats.lowest}</span>
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold tracking-tight">Weight Logs</h3>

          {logs.length === 0 ? (
            <div className="bg-card flex flex-col items-center justify-center space-y-4 rounded-xl border border-dashed p-8 text-center">
              <span className="mb-2 text-4xl">⚖️</span>
              <h4 className="text-lg font-semibold">No weight records yet.</h4>
              <p className="text-muted-foreground max-w-sm">Start tracking your progress.</p>
              <Button onClick={handleAdd}>Record First Weight</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLogs.map((log) => (
                <WeightLogCard key={log.id} log={log} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
