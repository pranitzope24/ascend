export const MEASUREMENT_PARTS = [
  "Neck",
  "Chest",
  "Waist",
  "Hips",
  "Bicep",
  "Forearm",
  "Thigh",
  "Calf",
] as const

export type MeasurementPart = typeof MEASUREMENT_PARTS[number]

export const PARTS_WITH_SIDES: MeasurementPart[] = ["Bicep", "Forearm", "Thigh", "Calf"]

export type MeasurementSide = "left" | "right"

export interface BodyMeasurementLog {
  id: string
  userId: string
  date: Date
  part: string
  side: string | null
  value: number
  unit: string
  createdAt: Date
  updatedAt: Date
}
