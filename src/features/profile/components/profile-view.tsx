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
      {/* Header & Level section */}
      <div className="flex flex-col items-center space-y-6 pb-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden ring-4 ring-background shadow-md">
            {user.image ? (
              <img src={user.image} alt={user.name || "User avatar"} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center border-4 border-background font-bold shadow-sm">
            {profile.level}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name || "Explorer"}</h2>
          <p className="text-muted-foreground font-medium">Level {profile.level} Explorer</p>
        </div>
      </div>

      {/* Progress section */}
      <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Current Progress</p>
            <div className="flex items-center gap-1.5 text-primary font-bold text-xl">
              <Star className="w-5 h-5 fill-current" />
              <span>{profile.currentXP} XP</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Wealth</p>
            <div className="flex items-center gap-1.5 font-bold text-lg justify-end">
              <span>🪙 {profile.coins}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Level {profile.level}</span>
            <span>100 XP to Level {profile.level + 1}</span>
          </div>
          <Progress value={(profile.currentXP / 100) * 100} className="h-3" />
        </div>
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
