"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { PageHeader, PageShell } from "@/components/shared/page-shell"
import { HabitForm } from "@/features/habits/components/habit-form"
import { useHabitStore } from "@/store/habit-store"

export default function EditHabitPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const habits = useHabitStore((state) => state.habits)
  const loadHabits = useHabitStore((state) => state.loadHabits)

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    void loadHabits().then(() => setIsLoaded(true))
  }, [loadHabits])

  if (!isLoaded) return null

  const habit = habits.find((h) => h.id === id)

  if (!habit) {
    router.replace("/habits")
    return null
  }

  return (
    <PageShell>
      <PageHeader description="Update the details of this habit." title="Edit habit" />
      <div className="mt-8">
        <HabitForm habit={habit} />
      </div>
    </PageShell>
  )
}
