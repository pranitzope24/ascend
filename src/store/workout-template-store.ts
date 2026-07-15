import { create } from "zustand"
import { getAll, create as createTemplateApi, update as updateTemplateApi, deleteTemplate as deleteTemplateApi, duplicate as duplicateTemplateApi } from "@/features/workouts/services/template-service"
import type { WorkoutTemplate, WorkoutTemplateFormValues } from "@/features/workouts/types"

interface WorkoutTemplateState {
  templates: WorkoutTemplate[]
  isLoading: boolean
  error: string | null
  
  loadTemplates: () => Promise<void>
  createTemplate: (values: WorkoutTemplateFormValues) => Promise<WorkoutTemplate>
  updateTemplate: (id: string, values: WorkoutTemplateFormValues) => Promise<WorkoutTemplate>
  deleteTemplate: (id: string) => Promise<void>
  duplicateTemplate: (id: string) => Promise<WorkoutTemplate>
}

const messageFor = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong"

export const useWorkoutTemplateStore = create<WorkoutTemplateState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  loadTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      const templates = await getAll()
      set({ templates, isLoading: false })
    } catch (error) {
      set({ error: messageFor(error), isLoading: false })
    }
  },

  createTemplate: async (values) => {
    try {
      const template = await createTemplateApi(values)
      set((state) => ({ templates: [template, ...state.templates], error: null }))
      return template
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  updateTemplate: async (id, values) => {
    try {
      const updated = await updateTemplateApi(id, values)
      set((state) => ({
        templates: state.templates.map((t) => (t.id === id ? updated : t)),
        error: null,
      }))
      return updated
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  deleteTemplate: async (id) => {
    try {
      await deleteTemplateApi(id)
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
        error: null,
      }))
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  },

  duplicateTemplate: async (id) => {
    try {
      const duplicated = await duplicateTemplateApi(id)
      set((state) => ({ templates: [duplicated, ...state.templates], error: null }))
      return duplicated
    } catch (error) {
      set({ error: messageFor(error) })
      throw error
    }
  }
}))
