"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame, Home, ListTodo, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { SettingsDialog } from "@/features/settings/components/settings-dialog"

export function MobileDock() {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/habits", label: "Habits", icon: ListTodo },
    { href: "/streaks", label: "Streaks", icon: Flame },
  ]

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center gap-3 md:hidden pointer-events-none px-4">
        {/* Main Pill */}
        <div className="flex items-center gap-1 bg-[#1c1c1e] border border-zinc-800 rounded-[2rem] p-1.5 shadow-xl pointer-events-auto shadow-black/50">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-20 h-16 rounded-[1.5rem] transition-colors",
                  isActive
                    ? "bg-[#2c2c2e]"
                    : "hover:bg-[#2c2c2e]/50"
                )}
              >
                <Icon className={cn("size-6", isActive ? "text-blue-500" : "text-zinc-400")} />
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wide",
                    isActive ? "text-blue-500" : "text-zinc-400"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Floating Settings Button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center justify-center size-16 shrink-0 bg-[#1c1c1e] border border-zinc-800 rounded-full shadow-xl transition-colors hover:bg-[#2c2c2e]/50 pointer-events-auto shadow-black/50"
          aria-label="Settings"
        >
          <Settings className="size-7 text-zinc-400" />
        </button>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
