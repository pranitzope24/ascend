"use client"

import { Archive, MoreHorizontal, Pencil, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HabitIcon } from "@/features/habits/components/habit-icon"
import type { Habit } from "@/features/habits/types"

interface HabitCardProps {
  habit: Habit
  onArchive: (habit: Habit) => void
  onEdit: (habit: Habit) => void
}

export function HabitCard({ habit, onArchive, onEdit }: HabitCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/30" size="sm">
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <button
          aria-label={`Edit ${habit.title}`}
          className="flex size-12 items-center justify-center rounded-2xl"
          onClick={() => onEdit(habit)}
          style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          type="button"
        >
          <HabitIcon name={habit.icon} />
        </button>
        <button className="min-w-0 text-left" onClick={() => onEdit(habit)} type="button">
          <CardTitle className="truncate">{habit.title}</CardTitle>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{habit.category}</span>
            <Badge variant="secondary">{habit.difficulty}</Badge>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <Zap className="size-3.5" /> {habit.xp} XP
            </span>
          </div>
        </button>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label={`Actions for ${habit.title}`} size="icon-sm" variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(habit)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(habit)}>
                <Archive /> Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
