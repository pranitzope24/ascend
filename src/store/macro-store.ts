import { create } from "zustand"
import { getMacroLogs, upsertMacroLog, bulkUpsertMacroLogs } from "@/features/macros/actions"
import { format } from "date-fns"

export interface MacroLog {
  id: string
  userId: string
  date: Date
  calories: number
  protein: number
  createdAt: Date
  updatedAt: Date
}

interface MacroState {
  logs: MacroLog[]
  isLoading: boolean
  error: string | null
  fetchLogs: () => Promise<void>
  upsertLog: (data: { date: Date; calories: number; protein: number }) => Promise<void>
  bulkUpsertLogs: (logs: { date: Date; calories: number; protein: number }[]) => Promise<void>
  getLogForDate: (date: Date) => MacroLog | undefined
}

export const useMacroStore = create<MacroState>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async () => {
    set({ isLoading: true, error: null })
    try {
      const fetchedLogs = await getMacroLogs()
      set({ logs: fetchedLogs as MacroLog[], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  upsertLog: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const updatedLog = await upsertMacroLog(data)
      set((state) => {
        const existingIndex = state.logs.findIndex((l) => l.id === updatedLog.id)
        if (existingIndex >= 0) {
          const newLogs = [...state.logs]
          newLogs[existingIndex] = updatedLog as MacroLog
          return { logs: newLogs, isLoading: false }
        } else {
          const newLogs = [updatedLog as MacroLog, ...state.logs].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          return { logs: newLogs, isLoading: false }
        }
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  bulkUpsertLogs: async (logsData) => {
    set({ isLoading: true, error: null })
    try {
      const updatedLogs = await bulkUpsertMacroLogs(logsData)
      set((state) => {
        const newLogs = [...state.logs]
        updatedLogs.forEach((updatedLog) => {
          const existingIndex = newLogs.findIndex((l) => l.id === updatedLog.id)
          if (existingIndex >= 0) {
            newLogs[existingIndex] = updatedLog as MacroLog
          } else {
            newLogs.push(updatedLog as MacroLog)
          }
        })
        newLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        return { logs: newLogs, isLoading: false }
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  getLogForDate: (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    return get().logs.find((log) => format(new Date(log.date), "yyyy-MM-dd") === formattedDate)
  },
}))
