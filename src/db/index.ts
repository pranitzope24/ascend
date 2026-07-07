import Dexie, { type EntityTable } from "dexie"

import type { AppSettings, Habit, HabitLog, Profile } from "@/features/habits/types"
import { DATABASE_NAME, DATABASE_SCHEMA } from "@/db/schema"

export class AscendDatabase extends Dexie {
  habits!: EntityTable<Habit, "id">
  habitLogs!: EntityTable<HabitLog, "id">
  settings!: EntityTable<AppSettings, "id">
  profile!: EntityTable<Profile, "id">

  constructor() {
    super(DATABASE_NAME)
    this.version(1).stores(DATABASE_SCHEMA)
  }
}

export const db = new AscendDatabase()
