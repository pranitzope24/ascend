export const DATABASE_NAME = "ascend"

export const DATABASE_SCHEMA = {
  habits: "id, title, category, difficulty, createdAt, updatedAt",
  habitLogs: "id, habitId, date, completed, [habitId+date]",
  settings: "id",
  profile: "id",
} as const
