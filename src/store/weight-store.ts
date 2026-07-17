import { create } from "zustand"
import { subMonths, subYears } from "date-fns"

export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL"

export interface BodyWeightLog {
  id: string
  userId: string
  weight: number
  recordedAt: string
  note: string | null
  createdAt: string
  updatedAt: string
}

interface WeightStore {
  logs: BodyWeightLog[]
  isLoading: boolean
  error: string | null
  timeRange: TimeRange

  setTimeRange: (range: TimeRange) => void
  fetchLogs: () => Promise<void>
  addLog: (weight: number, recordedAt: string, note?: string) => Promise<void>
  updateLog: (id: string, weight: number, recordedAt: string, note?: string) => Promise<void>
  deleteLog: (id: string) => Promise<void>
}

function getStartDateForRange(range: TimeRange): Date | null {
  const now = new Date()
  switch (range) {
    case "1M":
      return subMonths(now, 1)
    case "3M":
      return subMonths(now, 3)
    case "6M":
      return subMonths(now, 6)
    case "1Y":
      return subYears(now, 1)
    case "ALL":
    default:
      return null
  }
}

export const useWeightStore = create<WeightStore>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,
  timeRange: "6M",

  setTimeRange: (range: TimeRange) => {
    set({ timeRange: range })
    get().fetchLogs()
  },

  fetchLogs: async () => {
    set({ isLoading: true, error: null })
    try {
      const range = get().timeRange
      const startDate = getStartDateForRange(range)

      let url = "/api/body-weight"
      if (startDate) {
        url += `?from=${startDate.toISOString()}`
      }

      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch logs")
      const data = await res.json()

      set({ logs: data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message, isLoading: false })
    }
  },

  addLog: async (weight: number, recordedAt: string, note?: string) => {
    try {
      const res = await fetch("/api/body-weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight, recordedAt, note }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add log")
      }

      await get().fetchLogs()
    } catch (err: any) {
      set({ error: err.message })
      throw err
    }
  },

  updateLog: async (id: string, weight: number, recordedAt: string, note?: string) => {
    try {
      const res = await fetch(`/api/body-weight/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight, recordedAt, note }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update log")
      }

      await get().fetchLogs()
    } catch (err: any) {
      set({ error: err.message })
      throw err
    }
  },

  deleteLog: async (id: string) => {
    try {
      // Optimistic update
      const previousLogs = get().logs
      set({ logs: previousLogs.filter((log) => log.id !== id) })

      const res = await fetch(`/api/body-weight/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        // Rollback
        set({ logs: previousLogs })
        throw new Error("Failed to delete log")
      }
    } catch (err: any) {
      set({ error: err.message })
      throw err
    }
  },
}))
