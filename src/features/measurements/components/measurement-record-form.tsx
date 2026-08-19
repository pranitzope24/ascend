"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { MEASUREMENT_PARTS, PARTS_WITH_SIDES } from "@/features/measurements/types"
import { useMeasurementStore } from "@/store/measurement-store"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  date: z.date({ message: "Date is required" }),
  measurements: z.record(z.string(), z.string().optional()),
})

export function MeasurementRecordForm() {
  const router = useRouter()
  const { bulkAddLogs } = useMeasurementStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      date: new Date(),
      measurements: {},
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const logsToSubmit: { date: Date; part: string; side?: string | null; value: number }[] = []

      Object.entries(values.measurements).forEach(([key, val]) => {
        if (!val || val.trim() === "") return
        const value = parseFloat(val)
        if (isNaN(value)) return

        let part = key
        let side = null
        if (key.includes("-")) {
          const parts = key.split("-")
          part = parts[0]
          side = parts[1]
        }

        logsToSubmit.push({
          date: values.date,
          part,
          side,
          value,
        })
      })

      if (logsToSubmit.length > 0) {
        await bulkAddLogs(logsToSubmit)
      }
      
      router.push("/profile/measurements")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate input fields
  const inputFields: { key: string; label: string }[] = []
  MEASUREMENT_PARTS.forEach((part) => {
    if (PARTS_WITH_SIDES.includes(part as any)) {
      inputFields.push({ key: `${part}-left`, label: `Left ${part}` })
      inputFields.push({ key: `${part}-right`, label: `Right ${part}` })
    } else {
      inputFields.push({ key: part, label: part })
    }
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-8 pt-4">
      <Field>
        <FieldLabel>Date</FieldLabel>
        <FieldContent>
          <Controller
            control={form.control}
            name="date"
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
                <PopoverContent
                  className="w-auto origin-top-left scale-90 p-0 sm:scale-100"
                  align="start"
                >
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
        {form.formState.errors.date && (
          <FieldError>{form.formState.errors.date.message}</FieldError>
        )}
      </Field>

      <div className="space-y-4 pt-2">
        <h3 className="font-semibold text-lg">Measurements (inches)</h3>
        <div className="grid grid-cols-2 gap-4">
          {inputFields.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium">{label}</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                {...form.register(`measurements.${key}` as const)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => router.back()} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Measurements"}
        </Button>
      </div>
    </form>
  )
}
