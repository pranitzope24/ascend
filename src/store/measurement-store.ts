import { create } from "zustand"
import { getMeasurementLogs, addMeasurementLog, deleteMeasurementLog, bulkAddMeasurementLogs } from "@/features/measurements/actions"
import type { BodyMeasurementLog } from "@/features/measurements/types"

interface MeasurementState {
  logs: BodyMeasurementLog[]
  isLoading: boolean
  error: string | null
  fetchLogs: () => Promise<void>
  addLog: (data: { date: Date; part: string; side?: string | null; value: number }) => Promise<void>
  bulkAddLogs: (logsData: { date: Date; part: string; side?: string | null; value: number }[]) => Promise<void>
  deleteLog: (id: string) => Promise<void>
}

export const useMeasurementStore = create<MeasurementState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null })
    try {
      const fetchedLogs = await getMeasurementLogs()
      set({ logs: fetchedLogs as BodyMeasurementLog[], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  addLog: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newLog = await addMeasurementLog({
        ...data,
        side: data.side || null,
        unit: "in",
      })
      set((state) => ({
        logs: [newLog as BodyMeasurementLog, ...state.logs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  bulkAddLogs: async (logsData) => {
    set({ isLoading: true, error: null })
    try {
      const newLogs = await bulkAddMeasurementLogs(logsData)
      set((state) => ({
        logs: [...newLogs as BodyMeasurementLog[], ...state.logs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteLog: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await deleteMeasurementLog(id)
      set((state) => ({
        logs: state.logs.filter((log) => log.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))
