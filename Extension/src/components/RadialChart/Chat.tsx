"use client"

import { PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts"

import { ChartContainer } from "@/components/ui/chart"

const chartConfig = {
  safe: {
    label: "Safe",
    color: "#22c55e",
    range: [71, 100],
  },
  suspicious: {
    label: "Suspicious",
    color: "#facc15", 
    range: [41, 70],
  },
  dangerous: {
    label: "Dangerous",
    color: "#ef4444",
    range: [0, 40],
  },
}

type ScoreChartProps = {
  score: number;
}


function ScoreChart({ score }: ScoreChartProps) {
    const status = Object.entries(chartConfig).find(([, { range }]) => score >= range[0] && score <= range[1])?.[1]

    const chartData = [{ value: score }]

    return (
        <>
            <ChartContainer config={chartConfig} className="m-auto mb-4 w-full max-w-[200px]">
                <RadialBarChart cy={"90%"} data={chartData}  startAngle={180} endAngle={(180 - (chartData[0].value / 100) * 180)}  innerRadius={80} outerRadius={130}>
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        <Label content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox && status) {
                                return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 20} className="fill-foreground text-2xl font-bold">
                                            {score}
                                        </tspan>
                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0)} className="fill-muted-foreground text-sm">
                                            Score
                                        </tspan>
                                    </text>
                                )
                            }
                            
                            return null
                        }}/>
                    </PolarRadiusAxis>

                    <RadialBar dataKey="value" cornerRadius={5} fill={status?.color} className="stroke-2"/>
                </RadialBarChart>
            </ChartContainer>

            <div className="flex items-center justify-center space-x-2">
                <span className="text-muted-foreground text-xl">Status:</span>
                <span style={{color: status?.color}} className="text-foreground text-xl font-bold uppercase">{status?.label}</span>
            </div>
        </>
    )
}


export default ScoreChart;