"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { price: "$1000-1500", count: 18 },
  { price: "$1500-2000", count: 32 },
  { price: "$2000-2500", count: 45 },
  { price: "$2500-3000", count: 27 },
  { price: "$3000-3500", count: 14 },
  { price: "$3500+", count: 6 },
]

export function PriceDistributionChart() {
  return (
    <ChartContainer
      config={{
        count: {
          label: "Number of Listings",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="price" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
