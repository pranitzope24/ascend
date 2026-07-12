"use client"

import { Archive, Check, Flame, MoreHorizontal, Pencil, Zap } from "lucide-react"

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
  onToggle: (habit: Habit) => void
  onViewHeatmap?: (habit: Habit) => void
  isCompleted: boolean
}

export function HabitCard({ habit, onArchive, onEdit, onToggle, onViewHeatmap, isCompleted }: HabitCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/30" size="sm">
      <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4">
        <button
          aria-label={isCompleted ? `Mark ${habit.title} incomplete` : `Complete ${habit.title}`}
          className="relative flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-95 sm:size-12 sm:rounded-2xl"
          onClick={() => onToggle(habit)}
          style={{ 
            backgroundColor: isCompleted ? habit.color : `${habit.color}20`, 
            color: isCompleted ? "#fff" : habit.color 
          }}
          type="button"
        >
          {isCompleted ? <Check className="size-6 animate-in zoom-in duration-200" /> : <HabitIcon name={habit.icon} />}
        </button>
        <button className="min-w-0 text-left" onClick={() => onEdit(habit)} type="button">
          <CardTitle className="truncate">{habit.title}</CardTitle>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs text-muted-foreground">{habit.category}</span>
            <Badge variant="secondary">{habit.difficulty}</Badge>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <Zap className="size-3.5" /> {habit.xp} XP
            </span>
            <span 
              className="flex items-center gap-1 text-xs font-medium cursor-pointer rounded-full px-1.5 py-0.5 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                if (onViewHeatmap) onViewHeatmap(habit)
              }}
            >
              <Flame className="size-3.5 text-orange-500 fill-orange-500" /> {habit.currentStreak}
            </span>
          </div>
        </button>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label={`Actions for ${habit.title}`} size="icon" variant="ghost">
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
