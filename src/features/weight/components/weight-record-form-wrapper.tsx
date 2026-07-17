"use client"

import { useSearchParams } from "next/navigation"
import { useWeightStore } from "@/store/weight-store"
import { WeightRecordForm } from "./weight-record-form"
import { useEffect, useState } from "react"

export function WeightRecordFormWrapper() {
  const searchParams = useSearchParams()
  const id = searchParams.get("edit")
  const { logs, fetchLogs } = useWeightStore()
  const [isReady, setIsReady] = useState(() => !(id && logs.length === 0))

  useEffect(() => {
    // If we have an id but no logs, we should probably fetch them
    if (id && logs.length === 0) {
      fetchLogs().then(() => setIsReady(true))
    }
  }, [id, logs.length, fetchLogs])

  if (!isReady) {
    return <div className="text-muted-foreground p-8 text-center">Loading...</div>
  }

  const existingLog = id ? logs.find((log) => log.id === id) : null

  return <WeightRecordForm existingLog={existingLog} />
}
