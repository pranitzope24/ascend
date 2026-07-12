"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IconPicker } from "@/features/habits/components/icon-picker"
import {
  DEFAULT_XP,
  HABIT_CATEGORIES,
  HabitDifficulty,
  type Habit,
} from "@/features/habits/types"
import { habitSchema, type HabitSchemaValues } from "@/features/habits/validation/habit-schema"
import { useHabitStore } from "@/store/habit-store"
import { cn } from "@/lib/utils"

const HABIT_COLORS = ["#0891b2", "#2563eb", "#7c3aed", "#db2777", "#dc2626", "#ea580c", "#16a34a"]

const emptyHabit: HabitSchemaValues = {
  title: "",
  description: "",
  icon: "Target",
  color: HABIT_COLORS[0],
  category: "Fitness",
  difficulty: HabitDifficulty.Easy,
  xp: DEFAULT_XP[HabitDifficulty.Easy],
}

interface HabitFormDialogProps {
  habit: Habit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HabitFormDialog({ habit, open, onOpenChange }: HabitFormDialogProps) {
  const createHabit = useHabitStore((state) => state.createHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)
  const form = useForm<HabitSchemaValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: emptyHabit,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      habit
        ? {
            title: habit.title,
            description: habit.description,
            icon: habit.icon,
            color: habit.color,
            category: habit.category,
            difficulty: habit.difficulty,
            xp: habit.xp,
          }
        : emptyHabit,
    )
  }, [form, habit, open])

  async function onSubmit(values: HabitSchemaValues) {
    try {
      if (habit) await updateHabit(habit.id, values)
      else await createHabit(values)
      onOpenChange(false)
    } catch {
      form.setError("root", { message: "We couldn't save this habit. Please try again." })
    }
  }

  return (
    <ResponsiveDialog
      className="md:max-w-2xl"
      description={habit ? "Update the details of this habit." : "Choose a clear action you want to repeat."}
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">Cancel</Button>
          <Button disabled={form.formState.isSubmitting} form="habit-form" type="submit">
            {form.formState.isSubmitting ? "Saving…" : habit ? "Save changes" : "Create habit"}
          </Button>
        </>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={habit ? "Edit habit" : "Create a habit"}
    >
        <form id="habit-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5 pb-4 md:pb-0">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-title">Name</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoFocus id="habit-title" placeholder="Read for 20 minutes" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-description">Description</FieldLabel>
                  <Textarea {...field} aria-invalid={fieldState.invalid} id="habit-description" placeholder="Optional context or a simple reminder" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="icon"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Icon</FieldLabel>
                  <IconPicker onChange={field.onChange} value={field.value} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="color"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Color</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {HABIT_COLORS.map((color) => (
                      <button
                        aria-label={`Use color ${color}`}
                        aria-pressed={field.value === color}
                        className={cn("size-8 rounded-full border-2 border-background ring-offset-2", field.value === color && "ring-2 ring-ring")}
                        key={color}
                        onClick={() => field.onChange(color)}
                        style={{ backgroundColor: color }}
                        type="button"
                      />
                    ))}
                  </div>
                </Field>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HABIT_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="difficulty"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Difficulty</FieldLabel>
                    <Select
                      onValueChange={(value) => {
                        if (!value) return
                        const difficulty = value as HabitDifficulty
                        field.onChange(difficulty)
                        if (!form.formState.dirtyFields.xp) form.setValue("xp", DEFAULT_XP[difficulty], { shouldValidate: true })
                      }}
                      value={field.value}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid} className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(HabitDifficulty).map((difficulty) => <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="xp"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-xp">XP</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="habit-xp"
                    min={1}
                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    type="number"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <FieldError errors={[form.formState.errors.root]} />
          </FieldGroup>
        </form>
    </ResponsiveDialog>
  )
}
