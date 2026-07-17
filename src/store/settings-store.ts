import { create } from "zustand"
import { getSettings, updateSettings } from "@/features/settings/services/settings-service"
import type { AppSettings } from "@/features/habits/types"

interface SettingsState {
  settings: AppSettings | null
  isLoading: boolean
  error: string | null
  loadSettings: () => Promise<void>
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: true,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      const settings = await getSettings()
      set({
        settings,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load settings",
        isLoading: false,
      })
    }
  },

  updateSettings: async (updates) => {
    try {
      const newSettings = await updateSettings(updates)
      set({ settings: newSettings, error: null })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update settings" })
      throw error
    }
  },
}))
