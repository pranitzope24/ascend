"use client"

import { Dumbbell, Flame, LayoutDashboard, ListTodo, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MobileDock() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/habits", label: "Habits", icon: ListTodo },
    { href: "/workouts", label: "Workouts", icon: Dumbbell },
    { href: "/streaks", label: "Streaks", icon: Flame },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="pointer-events-none fixed right-0 bottom-6 left-0 z-50 flex items-center justify-center px-4 md:hidden">
      {/* Main Pill */}
      <div className="bg-background pointer-events-auto flex items-center gap-0.5 rounded-full border p-1 shadow-xl shadow-black/5 dark:shadow-black/50">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-12 w-[56px] flex-col items-center justify-center gap-0.5 rounded-full transition-colors",
                isActive
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="size-[18px]" />
              <span className="text-[9px] font-medium tracking-wide">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
