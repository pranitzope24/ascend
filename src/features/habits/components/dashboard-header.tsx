import { Trophy, Target, Star } from "lucide-react"
import Link from "next/link"

import { Progress } from "@/components/ui/progress"
import type { Profile } from "@/features/habits/types"

interface DashboardHeaderProps {
  profile: Profile | null
  totalHabits: number
  completedHabits: number
}

export function DashboardHeader({ profile, totalHabits, completedHabits }: DashboardHeaderProps) {
  if (!profile) return null

  const completionPercentage =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  return (
    <div className="mb-6 space-y-4">
      {/* Profile Overview Card */}
      <div className="bg-card rounded-2xl border p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-background flex h-12 w-12 items-center justify-center rounded-full ring-4">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Current Level</p>
              <h2 className="text-2xl font-bold tracking-tight">Level {profile.currentLevel}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm font-medium">Today&apos;s Progress</p>
            <p className="text-primary text-2xl font-bold tracking-tight">
              {completionPercentage}%
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>{profile.currentXP} XP</span>
            <span>100 XP to Level {profile.currentLevel + 1}</span>
          </div>
          <Progress value={profile.currentXP} className="h-2" />
        </div>
      </div>

      {/* Daily Quest / Motivation Block */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="bg-muted/30 flex items-center gap-3 rounded-2xl border px-4 py-3">
          <Target className="h-5 w-5 text-blue-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Daily Quest</p>
            <p className="text-muted-foreground truncate text-xs">
              Complete all {totalHabits} habits today
            </p>
          </div>
        </div>

        <Link
          href="/streaks"
          className="bg-muted/30 hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors"
        >
          <Star className="h-5 w-5 text-amber-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Current Streak</p>
            <p className="text-muted-foreground truncate text-xs">Build momentum today</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
