import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { WorkoutTemplate } from "@/features/workouts/types"
import { Play } from "lucide-react"

interface WorkoutTemplateCardProps {
  template: WorkoutTemplate
  onStart: (template: WorkoutTemplate) => void
  onEdit: (template: WorkoutTemplate) => void
}

export function WorkoutTemplateCard({ template, onStart, onEdit }: WorkoutTemplateCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onEdit(template)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            {template.description && (
              <CardDescription className="line-clamp-2 mt-1">{template.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground pt-0">
        <span>{template.exercises.length} Exercises</span>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onStart(template)
          }}
          className="rounded-full"
        >
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
      </CardFooter>
    </Card>
  )
}
