import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageShellProps {
  children: ReactNode
  className?: string
  size?: "default" | "wide"
}

export function PageShell({ children, className, size = "default" }: PageShellProps) {
  return (
    <main
      className={cn(
        "mx-auto min-h-dvh w-full px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-10 lg:px-8 lg:pt-12",
        size === "default" ? "max-w-3xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </main>
  )
}

interface PageHeaderProps {
  actions?: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
  className?: string
}

export function PageHeader({ actions, className, description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className={cn("mb-6 flex flex-wrap min-w-0 items-start gap-y-4 gap-x-3 sm:mb-8 sm:gap-6", className)}>
      <div className="flex-1 min-w-[200px]">
        {eyebrow && <p className="mb-1 text-sm font-medium text-primary">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-pretty text-muted-foreground sm:mt-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2 ml-auto">{actions}</div>}
    </header>
  )
}
