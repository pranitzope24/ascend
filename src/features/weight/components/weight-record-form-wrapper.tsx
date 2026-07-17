"use client"

import { useSearchParams } from "next/navigation"
import { useWeightStore } from "@/store/weight-store"
import { WeightRecordForm } from "./weight-record-form"
import { useEffect, useState } from "react"

export function WeightRecordFormWrapper() {
  const searchParams = useSearchParams()
  const id = searchParams.get("edit")
  const { logs, fetchLogs } = useWeightStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // If we have an id but no logs, we should probably fetch them
    if (id && logs.length === 0) {
      fetchLogs().then(() => setIsReady(true))
    } else {
      setIsReady(true)
    }
  }, [id, logs.length, fetchLogs])

  if (!isReady) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>
  }

  const existingLog = id ? logs.find(log => log.id === id) : null

  return <WeightRecordForm existingLog={existingLog} />
}
