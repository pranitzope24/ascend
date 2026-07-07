import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CircleDollarSign,
  Dumbbell,
  Heart,
  HeartPulse,
  Leaf,
  ListChecks,
  MoonStar,
  PersonStanding,
  Sparkles,
  Sun,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export const HABIT_ICONS: Record<string, LucideIcon> = {
  Target,
  Dumbbell,
  BookOpen,
  Brain,
  HeartPulse,
  Heart,
  BriefcaseBusiness,
  CircleDollarSign,
  Users,
  ListChecks,
  Leaf,
  MoonStar,
  PersonStanding,
  Sparkles,
  Sun,
}

interface HabitIconProps {
  name: string
  className?: string
}

export function HabitIcon({ name, className }: HabitIconProps) {
  const Icon = HABIT_ICONS[name] ?? Target
  return <Icon aria-hidden="true" className={cn("size-5", className)} />
}
