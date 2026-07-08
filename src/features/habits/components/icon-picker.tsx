"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HabitIcon, HABIT_ICONS } from "@/features/habits/components/habit-icon"
import { cn } from "@/lib/utils"

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [query, setQuery] = useState("")
  const icons = useMemo(
    () => Object.keys(HABIT_ICONS).filter((name) => name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Search icons"
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search icons"
          value={query}
        />
      </div>
      <div className="grid max-h-36 grid-cols-6 place-items-center gap-1 overflow-y-auto rounded-2xl border p-2 sm:grid-cols-8">
        {icons.map((name) => (
          <Button
            aria-label={`Use ${name} icon`}
            aria-pressed={name === value}
            className={cn(name === value && "bg-primary text-primary-foreground hover:bg-primary/90")}
            key={name}
            onClick={() => onChange(name)}
            size="icon-lg"
            type="button"
            variant="ghost"
          >
            <HabitIcon name={name} />
          </Button>
        ))}
      </div>
    </div>
  )
}
