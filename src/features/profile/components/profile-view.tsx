import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LogOut,
  User,
  Scale,
  Flame,
  CalendarCheck,
  Dumbbell,
  Star,
  ChevronRight,
  Timer,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "@/auth"

type ProfileStats = {
  user: { name: string | null; image: string | null }
  profile: { level: number; currentXP: number; nextLevelXP: number; coins: number }
  stats: {
    longestStreak: number
    habitsCompleted: number
    workouts: number
    totalWorkoutDuration: number
    totalXP: number
  }
}

export function ProfileView({ data }: { data: ProfileStats }) {
  const { user, profile, stats } = data

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-8 p-6">
      {/* Header & Level section */}
      <div className="flex flex-col items-center space-y-6 pb-2">
        <div className="relative">
          <div className="bg-secondary ring-background flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-md ring-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User avatar"}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="text-muted-foreground h-12 w-12" />
            )}
          </div>
          <div className="bg-primary text-primary-foreground border-background absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-4 font-bold shadow-sm">
            {profile.level}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name || "Explorer"}</h2>
          <p className="text-muted-foreground font-medium">Level {profile.level} Explorer</p>
        </div>
      </div>

      {/* Progress section */}
      <div className="bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-muted-foreground mb-1 text-sm font-medium">Current Progress</p>
            <div className="text-primary flex items-center gap-1.5 text-xl font-bold">
              <Star className="h-5 w-5 fill-current" />
              <span>{profile.currentXP} XP</span>
            </div>
          </div>
          <div className="text-right">
            <p className="mb-1 text-sm font-medium text-amber-600 dark:text-amber-400">Wealth</p>
            <div className="flex items-center justify-end gap-1.5 text-lg font-bold">
              <span>🪙 {profile.coins}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>Level {profile.level}</span>
            <span>100 XP to Level {profile.level + 1}</span>
          </div>
          <Progress value={(profile.currentXP / 100) * 100} className="h-3" />
        </div>
      </div>

      {/* Health section */}
      <div className="space-y-4">
        <h3 className="px-1 text-lg font-semibold tracking-tight">Health</h3>
        <div className="bg-card overflow-hidden rounded-xl border">
          <Link
            href="/profile/weight"
            className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Scale className="text-muted-foreground h-5 w-5" />
              <span className="font-medium">Weight Tracker</span>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Statistics section */}
      <div className="space-y-4">
        <h3 className="px-1 text-lg font-semibold tracking-tight">Statistics</h3>
        <div className="bg-card divide-y overflow-hidden rounded-xl border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Longest Streak</span>
            </div>
            <span className="text-muted-foreground font-semibold">{stats.longestStreak} days</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Habits Completed</span>
            </div>
            <span className="text-muted-foreground font-semibold">{stats.habitsCompleted}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Workouts</span>
            </div>
            <span className="text-muted-foreground font-semibold">{stats.workouts}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-green-500" />
              <span className="font-medium">Total Workout Time</span>
            </div>
            <span className="text-muted-foreground font-semibold">
              {stats.totalWorkoutDuration > 3600
                ? `${(stats.totalWorkoutDuration / 3600).toFixed(1)} hrs`
                : `${Math.round(stats.totalWorkoutDuration / 60)} min`}
            </span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 fill-current text-yellow-500" />
              <span className="font-medium">Total XP Earned</span>
            </div>
            <span className="text-muted-foreground font-semibold">
              {stats.totalXP.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="pt-4 pb-8">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-12 w-full rounded-xl font-semibold"
          >
            <LogOut className="mr-2 h-5 w-5" /> Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
