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
    <Card
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onEdit(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            {template.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {template.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="text-muted-foreground flex items-center justify-between pt-0 text-sm">
        <span>{template.exercises.length} Exercises</span>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onStart(template)
          }}
          className="rounded-full"
        >
          <Play className="mr-2 h-4 w-4" />
          Start
        </Button>
      </CardFooter>
    </Card>
  )
}
