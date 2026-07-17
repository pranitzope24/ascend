"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format, parseISO } from "date-fns"
import type { BodyWeightLog } from "@/store/weight-store"

const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--color-primary)",
  },
}

export function WeightChart({ logs }: { logs: BodyWeightLog[] }) {
  const chartData = useMemo(() => {
    return logs.map((log) => ({
      date: format(parseISO(log.recordedAt), "dd MMM yyyy"),
      weight: log.weight,
      originalDate: log.recordedAt,
    }))
  }, [logs])

  if (logs.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center border rounded-xl bg-card">
        <span className="text-3xl mb-2">⚖️</span>
        <p className="text-muted-foreground">No data available for this range.</p>
      </div>
    )
  }

  const minWeight = Math.min(...logs.map(l => l.weight))
  const maxWeight = Math.max(...logs.map(l => l.weight))
  
  const yDomain = [
    Math.max(0, Math.floor(minWeight - 2)),
    Math.ceil(maxWeight + 2)
  ]

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <YAxis 
          domain={yDomain}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={40}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent 
              indicator="dot" 
              labelFormatter={(value) => value}
              formatter={(value: any) => [`${Number(value).toFixed(2)} kg`, "Weight"]}
            />
          }
        />
        <Area
          type="natural"
          dataKey="weight"
          stroke="var(--color-weight)"
          strokeWidth={3}
          fill="url(#fillWeight)"
          isAnimationActive={true}
          dot={{ r: 4, fill: "var(--color-weight)", strokeWidth: 2, stroke: "var(--color-background)" }}
          activeDot={{ r: 6, fill: "var(--color-weight)", strokeWidth: 2, stroke: "var(--color-background)" }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
