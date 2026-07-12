"use client"

import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import { useSettingsStore } from "@/store/settings-store"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings } = useSettingsStore()

  if (!settings) return null

  return (
    <ResponsiveDialog
      className="md:max-w-md"
      title="Settings"
      description="Manage your preferences."
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
          Close
        </Button>
      }
    >
      <div className="space-y-6 py-4">
        <p className="text-sm text-muted-foreground">More settings coming soon.</p>
      </div>
    </ResponsiveDialog>
  )
}
