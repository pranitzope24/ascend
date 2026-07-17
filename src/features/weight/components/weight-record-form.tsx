"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { useWeightStore, type BodyWeightLog } from "@/store/weight-store"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  weight: z.coerce.number({ message: "Weight is required" }).min(1, "Weight must be greater than 0"),
  recordedAt: z.date({ message: "Date is required" }),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface WeightRecordFormProps {
  existingLog?: BodyWeightLog | null
}

export function WeightRecordForm({ existingLog }: WeightRecordFormProps) {
  const router = useRouter()
  const { addLog, updateLog } = useWeightStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      weight: existingLog ? existingLog.weight : undefined,
      recordedAt: existingLog ? parseISO(existingLog.recordedAt) : new Date(),
      note: existingLog?.note || "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const isoDate = data.recordedAt.toISOString()
      if (existingLog) {
        await updateLog(existingLog.id, data.weight, isoDate, data.note)
      } else {
        await addLog(data.weight, isoDate, data.note)
      }
      router.push("/profile/weight")
      router.refresh()
    } catch (error: any) {
      setServerError(error.message || "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <form id="weight-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {serverError && <div className="text-sm font-medium text-destructive">{serverError}</div>}
      <Field>
        <FieldLabel>Weight (kg)</FieldLabel>
        <FieldContent>
          <Input 
            type="number" 
            step="0.01" 
            placeholder="e.g. 72.40"
            {...form.register("weight", { valueAsNumber: true })} 
          />
        </FieldContent>
        {form.formState.errors.weight && <FieldError>{form.formState.errors.weight.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>Date</FieldLabel>
        <FieldContent>
          <Controller
            control={form.control}
            name="recordedAt"
            render={({ field }) => (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 scale-90 sm:scale-100 origin-top-left" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date)
                        setCalendarOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </FieldContent>
        {form.formState.errors.recordedAt && <FieldError>{form.formState.errors.recordedAt.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>Notes (Optional)</FieldLabel>
        <FieldContent>
          <Textarea 
            placeholder="How are you feeling?"
            {...form.register("note")} 
          />
        </FieldContent>
        {form.formState.errors.note && <FieldError>{form.formState.errors.note.message}</FieldError>}
      </Field>
      
      <div className="flex w-full justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => router.back()} type="button">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
