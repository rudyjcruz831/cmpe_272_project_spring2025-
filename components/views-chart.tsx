"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Generate the last 30 days
const generateData = () => {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const formattedDate = `${month}/${day}`

    // Generate a somewhat realistic pattern with weekends having more views
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseViews = Math.floor(Math.random() * 100) + 150
    const views = isWeekend ? baseViews * 1.5 : baseViews

    data.push({
      date: formattedDate,
      views: Math.floor(views),
    })
  }
  return data
}

const data = generateData()

export function ViewsChart() {
  return (
    <ChartContainer
      config={{
        views: {
          label: "Views",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => value}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
