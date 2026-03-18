import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { gmv: "$50K", frt: 52, frt2: 58 },
  { gmv: "$100K", frt: 48, frt2: 54 },
  { gmv: "$150K", frt: 42, frt2: 49 },
  { gmv: "$200K", frt: 38, frt2: 45 },
  { gmv: "$250K", frt: 32, frt2: 40 },
  { gmv: "$300K", frt: 28, frt2: 35 },
  { gmv: "$400K", frt: 24, frt2: 30 },
  { gmv: "$500K", frt: 20, frt2: 26 },
  { gmv: "$750K", frt: 17, frt2: 22 },
  { gmv: "$1M", frt: 14, frt2: 19 },
]

const FRT_COLOR = "#CDC2FF"
const FRT2_COLOR = "#F5D4FF"

const chartConfig = {
  frt: {
    label: "First Response Time",
    color: FRT_COLOR,
  },
  frt2: {
    label: "Industry Median",
    color: FRT2_COLOR,
  },
} satisfies ChartConfig

export function FrtChart() {
  return (
    <div className="bg-card flex flex-col gap-6 sm:gap-8 md:gap-10 overflow-hidden p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full">
      <div className="flex flex-col gap-0">
        <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          First response time – by GMV
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-text-soft">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[250px] sm:h-[320px] md:h-[397px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-[#696763]"
      >
        <AreaChart data={chartData} margin={{ left: 0, bottom: 16, top: 4, right: 8 }}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--border-muted)"
            vertical={false}
          />
          <XAxis
            dataKey="gmv"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#696763", fontSize: 12, fontFamily: "var(--font-mono)" }}
            tickMargin={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#696763", fontSize: 12, fontFamily: "var(--font-mono)" }}
            width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillFrt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FRT_COLOR} stopOpacity={0.3} />
              <stop offset="100%" stopColor={FRT_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillFrt2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FRT2_COLOR} stopOpacity={0.3} />
              <stop offset="100%" stopColor={FRT2_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="frt2"
            stroke={FRT2_COLOR}
            strokeWidth={2}
            fill="url(#fillFrt2)"
          />
          <Area
            type="monotone"
            dataKey="frt"
            stroke={FRT_COLOR}
            strokeWidth={2}
            fill="url(#fillFrt)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
