"use client"

import type { ReactElement, ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface ResponsiveDialogProps {
  bodyClassName?: string
  children: ReactNode
  className?: string
  description?: ReactNode
  footer?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  trigger?: ReactElement
}

/**
 * A centered dialog on desktop and a bottom drawer on mobile.
 * Keep feature-specific forms in `children`; this component owns responsive,
 * scrolling, safe-area, and accessible title/description behavior.
 */
export function ResponsiveDialog({
  bodyClassName,
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  title,
  trigger,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          className={cn(
            "flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden md:max-w-xl",
            className
          )}
        >
          <DialogHeader className="shrink-0 pr-8 pb-5">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", bodyClassName)}>
            {children}
          </div>
          {footer && <DialogFooter className="shrink-0 border-t pt-5">{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer fixed onOpenChange={onOpenChange} open={open}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className={cn("max-h-[92dvh] pb-[env(safe-area-inset-bottom)]", className)}>
        <DrawerHeader className="shrink-0 px-4 pt-4 pb-3 text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div
          className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-4", bodyClassName)}
        >
          {children}
        </div>
        {footer && (
          <DrawerFooter className="shrink-0 border-t px-4 pt-4 pb-4">{footer}</DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
