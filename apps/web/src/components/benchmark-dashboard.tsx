"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Slider } from "@workspace/ui/components/slider"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { StatCard } from "./stat-card"
import { AiStatCard } from "./ai-stat-card"
import { SectionTag } from "./section-tag"
import { IntentTag } from "./intent-tag"

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

const industryOptions = {
  "all-industries": "All industries",
  fashion: "Fashion",
  beauty: "Beauty",
  electronics: "Electronics",
} as const

const metricOptions = {
  "approximate-gmv": "Approximate GMV",
  orders: "Monthly Orders",
  tickets: "Monthly Tickets",
} as const

const chartDropdownOptions = {
  dropdown: "Dropdown",
  chat: "Chat FRT",
  email: "Email FRT",
} as const

export function BenchmarkDashboard() {
  const [industry, setIndustry] = useState("all-industries")
  const [metric, setMetric] = useState("approximate-gmv")
  const [chartMetric, setChartMetric] = useState("dropdown")

  return (
    <div className="border-t border-dashed border-border-soft flex flex-col items-center px-20">
      <div className="border-l border-r border-dashed border-border-soft flex flex-col gap-12 items-start max-w-[1440px] w-full px-10 py-20">
        {/* Header */}
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col gap-6 max-w-[512px]">
            <SectionTag number="01" label="Live index" />
            <div className="flex flex-col gap-3">
              <h1 className="font-heading text-5xl leading-[1.2] text-text-primary">
                CX Benchmark explorer
              </h1>
              <p className="text-base leading-relaxed text-[#1a1e23]">
                Interpolated cx metrics by industry and gmv. Data from last 90
                days across gorgias customers.
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 h-11 px-6 py-3 border border-border-soft rounded-full text-base text-text-primary">
              {industryOptions[industry as keyof typeof industryOptions]}
              <ChevronDown className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={industry} onValueChange={setIndustry}>
                <DropdownMenuRadioItem value="all-industries">All industries</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fashion">Fashion</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="beauty">Beauty</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="electronics">Electronics</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 w-full">
          {/* GMV Slider Card */}
          <div className="bg-card flex items-center justify-between overflow-hidden p-6 rounded-2xl w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 h-11 px-6 py-3 border border-border-soft rounded-full text-base text-text-primary">
                {metricOptions[metric as keyof typeof metricOptions]}
                <ChevronDown className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={metric} onValueChange={setMetric}>
                  <DropdownMenuRadioItem value="approximate-gmv">Approximate GMV</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="orders">Monthly Orders</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tickets">Monthly Tickets</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex-1 flex flex-col gap-2 min-h-px min-w-px max-w-[768px]">
              <Slider defaultValue={[50]} min={0} max={100} />
              <div className="flex items-center justify-between font-mono text-sm text-[#73716d] tracking-[0.1em] uppercase w-full">
                <span>$100K</span>
                <span>$1M</span>
                <span>$100M</span>
                <span>$250M+</span>
              </div>
            </div>
          </div>

          {/* Quality & Satisfaction */}
          <div className="flex flex-col gap-3 w-full">
            <h2 className="text-xl leading-relaxed text-text-primary">
              Quality &amp; Satisfaction
            </h2>
            <div className="grid grid-cols-4 gap-4 w-full">
              <StatCard
                title="One-touch rate"
                value="27.3%"
                detail="Median"
                highlight={{ value: "48.5%", label: "best" }}
              />
              <StatCard
                title="CSAT score"
                value="4.52"
                detail="Median (out of 5)"
              />
              <StatCard title="NPS score" value="+11" detail="Net promoter score" />
              <StatCard
                title="Messages / ticket"
                value="3.3"
                detail="Median per ticket"
              />
            </div>
          </div>

          {/* Response & Resolution */}
          <div className="flex flex-col gap-3 w-full">
            <h2 className="text-xl leading-relaxed text-text-primary">
              Response &amp; Resolution
            </h2>
            <div className="grid grid-cols-4 gap-4 w-full">
              <StatCard
                title="Chat FRT"
                value="45.0m"
                detail="Median chat channel"
              />
              <StatCard
                title="Email FRT"
                value="9.0h"
                detail="Median email channel"
              />
              <StatCard
                title="Email FRT"
                value="9.0h"
                detail="Median email channel"
              />
              <StatCard
                title="Resolution time"
                value="20.2h"
                detail="Median"
                highlight={{ value: "3.6h", label: "best" }}
              />
            </div>
          </div>

          {/* AI & Automation */}
          <div className="flex flex-col gap-3 w-full">
            <h2 className="text-xl leading-relaxed text-text-primary">
              AI &amp; Automation
            </h2>
            <div className="grid grid-cols-4 gap-4 w-full">
              <AiStatCard
                title="AI Agent Rate"
                value="0.0%"
                percentage={0}
                detail="Median ai-handled %"
              />
              <AiStatCard
                title="AI Success Rate"
                value="30.8%"
                percentage={30.8}
                detail="% with ai agent enabled"
              />
              <AiStatCard
                title="AI Adoption"
                value="21.3%"
                percentage={21.3}
                detail="% with ai agent enabled"
              />
              <AiStatCard
                title="SA Conversion"
                value="11.73%"
                percentage={11.73}
                detail="Shopping assistant cvr"
              />
            </div>
          </div>

          {/* Volume & Efficiency */}
          <div className="flex flex-col gap-3 w-full">
            <h2 className="text-xl leading-relaxed text-text-primary">
              Volume &amp; Efficiency
            </h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Tickets / 100 orders"
                  titleCase="upper"
                  value="42.5"
                  detail="Support intensity"
                />
                <StatCard
                  title="Utilization rate"
                  titleCase="upper"
                  value="53.3%"
                  detail="Billable / allotted"
                />
              </div>
              <div className="bg-card flex flex-col items-start justify-between overflow-hidden p-6 rounded-2xl">
                <p className="font-medium text-base tracking-wide uppercase text-text-primary">
                  Top Intents
                </p>
                <div className="flex flex-wrap gap-2 w-full">
                  <IntentTag label="Order" value="43.6%" />
                  <IntentTag label="Product" value="11.8%" />
                  <IntentTag label="Return" value="10.9%" />
                  <IntentTag label="Subscription" value="9.6%" />
                  <IntentTag label="Shipping" value="9.4%" />
                </div>
              </div>
            </div>
          </div>

          {/* First Response Time Chart */}
          <div className="bg-card flex flex-col gap-10 overflow-hidden p-8 rounded-3xl w-full">
            <div className="flex gap-2 items-start w-full">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-xl leading-relaxed text-text-primary">
                  First response time – by GMV
                </h3>
                <p className="text-base text-text-soft">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 h-9 px-4 border border-border-muted rounded-lg text-sm font-medium text-text-primary shadow-xs">
                  {chartDropdownOptions[chartMetric as keyof typeof chartDropdownOptions]}
                  <ChevronDown className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={chartMetric} onValueChange={setChartMetric}>
                    <DropdownMenuRadioItem value="dropdown">Dropdown</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="chat">Chat FRT</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="email">Email FRT</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ChartContainer config={chartConfig} className="h-[397px] w-full">
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
        </div>
      </div>
    </div>
  )
}
