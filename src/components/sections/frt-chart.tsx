import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { gmv: "$50K", frt: 52 },
  { gmv: "$100K", frt: 48 },
  { gmv: "$150K", frt: 42 },
  { gmv: "$200K", frt: 38 },
  { gmv: "$250K", frt: 32 },
  { gmv: "$300K", frt: 28 },
  { gmv: "$400K", frt: 24 },
  { gmv: "$500K", frt: 20 },
  { gmv: "$750K", frt: 17 },
  { gmv: "$1M", frt: 14 },
]

const chartConfig = {
  frt: {
    label: "First Response Time",
    color: "var(--brand-blue-300)",
  },
} satisfies ChartConfig

const chartDropdownOptions = {
  dropdown: "Dropdown",
  chat: "Chat FRT",
  email: "Email FRT",
} as const

export function FrtChart() {
  const [chartMetric, setChartMetric] = useState("dropdown")

  return (
    <div className="bg-card flex flex-col gap-6 sm:gap-8 md:gap-10 overflow-hidden p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 sm:items-start w-full">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-lg sm:text-xl leading-relaxed text-text-primary">
            First response time – by GMV
          </h3>
          <p className="text-sm sm:text-base text-text-soft">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 h-9 px-4 border border-border-muted rounded-lg text-sm font-medium text-text-primary shadow-xs">
            {
              chartDropdownOptions[
                chartMetric as keyof typeof chartDropdownOptions
              ]
            }
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={chartMetric}
              onValueChange={setChartMetric}
            >
              <DropdownMenuRadioItem value="dropdown">
                Dropdown
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chat">
                Chat FRT
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="email">
                Email FRT
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[250px] sm:h-[320px] md:h-[397px] w-full"
      >
        <AreaChart data={chartData}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--border-muted)"
            vertical={false}
          />
          <XAxis
            dataKey="gmv"
            tickLine={false}
            axisLine={false}
            className="font-mono text-sm text-text-muted tracking-widest uppercase"
            tick={{ fill: "#73716d", fontSize: 14 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="font-mono text-sm text-text-muted tracking-widest uppercase"
            tick={{ fill: "#73716d", fontSize: 14 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillFrt" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--brand-blue-300)"
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor="var(--brand-blue-300)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="frt"
            stroke="var(--brand-blue-300)"
            strokeWidth={2}
            fill="url(#fillFrt)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
