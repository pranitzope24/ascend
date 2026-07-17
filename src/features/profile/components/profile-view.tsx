import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LogOut, User, Scale, Flame, CalendarCheck, Dumbbell, Star, ChevronRight, Timer } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/auth"

type ProfileStats = {
  user: { name: string | null; image: string | null }
  profile: { level: number; currentXP: number; nextLevelXP: number; coins: number }
  stats: { longestStreak: number; habitsCompleted: number; workouts: number; totalWorkoutDuration: number; totalXP: number }
}

export function ProfileView({ data }: { data: ProfileStats }) {
  const { user, profile, stats } = data

  return (
    <div className="flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full">
      {/* Header section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img src={user.image} alt={user.name || "User avatar"} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name || "Explorer"}</h2>
          <p className="text-muted-foreground font-medium">Level {profile.level} Explorer</p>
        </div>
      </div>

      {/* Progress section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-medium px-1">
          <div className="flex items-center gap-1.5 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span>{profile.currentXP} / {profile.nextLevelXP} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span>🪙 {profile.coins} Coins</span>
          </div>
        </div>
        <Progress value={(profile.currentXP / profile.nextLevelXP) * 100} className="h-3 bg-secondary" />
      </div>

      {/* Health section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight px-1">Health</h3>
        <div className="rounded-xl border bg-card overflow-hidden">
          <Link href="/profile/weight" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Weight Tracker</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Statistics section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight px-1">Statistics</h3>
        <div className="rounded-xl border bg-card overflow-hidden divide-y">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-medium">Longest Streak</span>
            </div>
            <span className="font-semibold text-muted-foreground">{stats.longestStreak} days</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Habits Completed</span>
            </div>
            <span className="font-semibold text-muted-foreground">{stats.habitsCompleted}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Workouts</span>
            </div>
            <span className="font-semibold text-muted-foreground">{stats.workouts}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-green-500" />
              <span className="font-medium">Total Workout Time</span>
            </div>
            <span className="font-semibold text-muted-foreground">
              {stats.totalWorkoutDuration > 3600 
                ? `${(stats.totalWorkoutDuration / 3600).toFixed(1)} hrs` 
                : `${Math.round(stats.totalWorkoutDuration / 60)} min`}
            </span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-medium">Total XP Earned</span>
            </div>
            <span className="font-semibold text-muted-foreground">{stats.totalXP.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="pt-4 pb-8">
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}>
          <Button type="submit" variant="outline" className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-semibold rounded-xl">
            <LogOut className="mr-2 w-5 h-5" /> Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
