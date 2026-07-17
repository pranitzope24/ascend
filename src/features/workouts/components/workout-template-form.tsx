"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  WorkoutTemplateFormSchema,
  type WorkoutTemplateFormValues,
  type WorkoutTemplate,
} from "@/features/workouts/types"
import { useWorkoutTemplateStore } from "@/store/workout-template-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { ExercisePicker } from "./exercise-picker"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface WorkoutTemplateFormProps {
  template?: WorkoutTemplate | null
  onSuccess?: () => void
}

export function WorkoutTemplateForm({ template, onSuccess }: WorkoutTemplateFormProps) {
  const router = useRouter()
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
      router.back()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <form id="template-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldContent>
            <Input placeholder="e.g. Push Day" {...form.register("name")} />
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Description (Optional)</FieldLabel>
          <FieldContent>
            <Textarea
              placeholder="A brief description of this workout"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <FieldError>{form.formState.errors.description.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Exercises</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>

          <div className="space-y-2">
            {fields.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No exercises added yet.
              </p>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-muted/30 flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="text-muted-foreground cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{field.exerciseName}</p>
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

        <div className="mt-8 flex justify-end gap-3 border-t pt-5">
          <Button onClick={() => router.back()} type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" form="template-form">
            {isEditing ? "Save Changes" : "Create Template"}
          </Button>
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
            sets: [],
          })
        }}
      />
    </>
  )
}
