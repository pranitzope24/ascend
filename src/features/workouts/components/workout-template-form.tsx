"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { WorkoutTemplateFormSchema, type WorkoutTemplateFormValues, type WorkoutTemplate } from "@/features/workouts/types"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { ExercisePicker } from "./exercise-picker"
import { useState } from "react"

interface WorkoutTemplateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: WorkoutTemplate | null
  onSuccess?: () => void
}

export function WorkoutTemplateForm({ open, onOpenChange, template, onSuccess }: WorkoutTemplateFormProps) {
  const { createTemplate, updateTemplate } = useWorkoutTemplateStore()
  const [pickerOpen, setPickerOpen] = useState(false)

  const form = useForm<WorkoutTemplateFormValues>({
    resolver: zodResolver(WorkoutTemplateFormSchema) as any,
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      exercises: template?.exercises || [],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises",
  })

  const isEditing = !!template

  const onSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await updateTemplate(template.id, values)
      } else {
        await createTemplate(values)
      }
      form.reset()
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  const footer = (
    <div className="flex w-full justify-between sm:justify-end gap-2">
      <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button type="submit" form="template-form">
        {isEditing ? "Save Changes" : "Create Template"}
      </Button>
    </div>
  )

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Template" : "New Template"}
      description={isEditing ? "Update your workout template details." : "Create a reusable workout template."}
      footer={footer}
    >
      <form id="template-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldContent>
            <Input placeholder="e.g. Push Day" {...form.register("name")} />
            {form.formState.errors.name && <FieldError>{form.formState.errors.name.message}</FieldError>}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Description (Optional)</FieldLabel>
          <FieldContent>
            <Textarea placeholder="A brief description of this workout" {...form.register("description")} />
            {form.formState.errors.description && <FieldError>{form.formState.errors.description.message}</FieldError>}
          </FieldContent>
        </Field>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Exercises</h3>
            {/* We will add an Exercise Picker hook here later */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          <div className="space-y-2">
            {fields.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No exercises added yet.</p>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{field.exerciseName}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </form>

      <ExercisePicker 
        open={pickerOpen} 
        onOpenChange={setPickerOpen} 
        onSelect={(exercise) => {
          append({
            id: crypto.randomUUID(),
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            exerciseOrder: fields.length,
            muscles: exercise.muscles || [],
            sets: []
          })
        }}
      />
    </ResponsiveDialog>
  )
}
