import type { WorkoutSession, WorkoutTemplate } from "@/features/workouts/types"

export function getSessionTemplateLabel(
  session: WorkoutSession,
  templates: WorkoutTemplate[]
): string {
  if (!session.templateId) {
    return "Custom"
  }

  return templates.find((template) => template.id === session.templateId)?.name || "Template"
}

