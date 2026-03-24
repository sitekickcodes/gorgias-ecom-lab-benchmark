"use client"

import { useState } from "react"
import { ChartEmbed } from "@/components/sections/chart-embed"
import { TooltipProvider } from "@/components/tooltip"
import type {
  SingleSeriesChartConfig,
  MultiLineChartConfig,
} from "@/components/sections/chart-embed/types"

// Example configs
const barConfig: SingleSeriesChartConfig = {
  title: "AI Agent Adoption Rate by GMV",
  subtitle: "% of stores with AI agents enabled",
  data: [
    { label: "$500K", value: 15.3 },
    { label: "$1M", value: 18.7 },
    { label: "$5M", value: 22.1 },
    { label: "$10M", value: 28.4 },
    { label: "$25M", value: 35.2 },
    { label: "$50M", value: 41.6 },
    { label: "$100M", value: 45.8 },
    { label: "$500M", value: 49.9 },
  ],
  xAxis: { label: "GMV" },
  yAxis: { label: "Adoption rate", format: "percent" },
}

const areaConfig: SingleSeriesChartConfig = {
  title: "First Response Time vs. Automation Rate",
  subtitle: "Median minutes to first response",
  source: "Gorgias platform data · March 2026",
  data: [
    { label: "0%", value: 736 },
    { label: "5%", value: 580 },
    { label: "10%", value: 420 },
    { label: "15%", value: 280 },
    { label: "20%", value: 165 },
    { label: "25%", value: 95 },
    { label: "30%", value: 52 },
    { label: "35%", value: 28 },
    { label: "40%", value: 12 },
  ],
  xAxis: { label: "Automation rate" },
  yAxis: { label: "First response time", format: "minutes" },
}

const multiLineConfig: MultiLineChartConfig = {
  title: "Human Team Size vs. AI Equivalents",
  xAxis: { label: "Automation rate" },
  yAxis: { label: "Agents" },
  series: [
    {
      key: "human",
      label: "Human team",
      color: "#B5D8CC",
      data: [
        { label: "10-20%", value: 5.2 },
        { label: "20-30%", value: 4.8 },
        { label: "30-40%", value: 4.1 },
        { label: "40-50%", value: 3.2 },
        { label: "50%+", value: 2.4 },
      ],
    },
    {
      key: "ai",
      label: "AI equivalents",
      color: "#CDC2FF",
      data: [
        { label: "10-20%", value: 1.1 },
        { label: "20-30%", value: 2.3 },
        { label: "30-40%", value: 3.8 },
        { label: "40-50%", value: 5.1 },
        { label: "50%+", value: 7.2 },
      ],
    },
  ],
}

const lineConfig: SingleSeriesChartConfig = {
  title: "AI Agent Adoption Over Time",
  subtitle: "Monthly adoption rate trend",
  data: [
    { label: "Apr 25", value: 12.3 },
    { label: "May 25", value: 13.1 },
    { label: "Jun 25", value: 13.8 },
    { label: "Jul 25", value: 14.5 },
    { label: "Aug 25", value: 15.2 },
    { label: "Sep 25", value: 16.1 },
    { label: "Oct 25", value: 16.8 },
    { label: "Nov 25", value: 17.4 },
    { label: "Dec 25", value: 17.9 },
    { label: "Jan 26", value: 17.6 },
  ],
  xAxis: { label: "Month" },
  yAxis: { label: "Adoption rate", format: "percent" },
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[#292827] text-[#e8e4de] text-[13px] leading-relaxed font-mono p-5 rounded-xl overflow-x-auto mb-6">
      <code>{children}</code>
    </pre>
  )
}

function Example({
  title,
  code,
  children,
}: {
  title: string
  code: string
  children: React.ReactNode
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  return (
    <div className="mb-8">
      <h3 className="text-base font-medium text-text-primary mb-4">
        {title}
      </h3>
      <div className="border border-border-muted rounded-2xl overflow-hidden">
        <div className="flex border-b border-[#efe9e2] bg-white">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-[13px] font-mono uppercase tracking-wider border-b-2 -mb-px cursor-pointer ${
                tab === t
                  ? "text-text-primary border-text-primary"
                  : "text-text-soft border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "preview" ? (
          <div className="p-6 bg-[#f6f4f2]">{children}</div>
        ) : (
          <pre className="bg-[#292827] text-[#e8e4de] text-[13px] leading-relaxed font-mono p-5 overflow-x-auto m-0">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}

const COLORS = [
  { name: "Lavender", hex: "#CDC2FF" },
  { name: "Salmon", hex: "#FFB5B5" },
  { name: "Peach", hex: "#FFCC9D" },
  { name: "Mint", hex: "#B2E6BE" },
  { name: "Lilac", hex: "#F5D4FF" },
  { name: "Sky", hex: "#A8D8EA" },
  { name: "Apricot", hex: "#FFD6A5" },
  { name: "Seafoam", hex: "#B5D8CC" },
  { name: "Rose", hex: "#E2B6CF" },
  { name: "Periwinkle", hex: "#C9DAF8" },
]

export default function DocsPage() {
  return (
    <TooltipProvider delay={200}>
      <div className="max-w-[960px] mx-auto px-6 py-16">
        <span className="inline-block font-mono text-xs tracking-widest uppercase bg-[#efe9e2] text-text-primary px-4 py-1 rounded-full mb-4">
          (01) Documentation
        </span>
        <h1 className="font-heading text-[42px] leading-[1.2] text-text-primary mb-2">
          Chart Embed API
        </h1>
        <p className="text-base text-text-soft mb-12">
          Embed styled charts into any page with a single div and a JSON
          config. Fonts, colors, tooltips, and responsive behavior are handled
          automatically.
        </p>

        {/* Quick Start */}
        <h2 className="text-2xl text-text-primary mb-4">Quick Start</h2>
        <p className="text-text-soft mb-4">
          Add the embed script to your page, then place chart divs wherever
          you want charts:
        </p>
        <CodeBlock>{`<!-- 1. Add the embed script (once per page) -->
<script src="https://gorgias.sitekick.co/embed.js" defer></script>

<!-- 2. Add a chart -->
<div data-gorgias="chart"
  data-chart-type="bar"
  data-chart-config='{
    "title": "Adoption by GMV",
    "data": [
      { "label": "$1M", "value": 18.7 },
      { "label": "$5M", "value": 22.1 }
    ],
    "yAxis": { "format": "percent" }
  }'>
</div>`}</CodeBlock>

        {/* Embedding Dashboard */}
        <h2 className="text-2xl text-text-primary mb-4 mt-12 pt-8 border-t border-[#efe9e2]">
          Embedding the Dashboard
        </h2>
        <p className="text-text-soft mb-4">
          Embed the full interactive benchmark dashboard with a single line:
        </p>
        <CodeBlock>{`<div data-gorgias="benchmark"></div>
<script src="https://gorgias.sitekick.co/embed.js" defer></script>`}</CodeBlock>

        {/* Chart Types */}
        <h2 className="text-2xl text-text-primary mb-4 mt-12 pt-8 border-t border-[#efe9e2]">
          Chart Types
        </h2>
        <table className="w-full text-sm mb-8">
          <thead>
            <tr>
              <th className="text-left font-medium p-2.5 border-b-2 border-[#dedbd5]">
                Type
              </th>
              <th className="text-left font-medium p-2.5 border-b-2 border-[#dedbd5]">
                Description
              </th>
              <th className="text-left font-medium p-2.5 border-b-2 border-[#dedbd5]">
                Best for
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["bar", "Vertical bar chart", "Comparing categories"],
              ["line", "Line chart with dots", "Trends over time"],
              ["area", "Line with gradient fill", "Volume trends"],
              ["multi-line", "Multiple named lines", "Comparing series"],
            ].map(([type, desc, best]) => (
              <tr key={type}>
                <td className="p-2.5 border-b border-[#efe9e2]">
                  <code className="font-mono text-[13px] bg-[#efe9e2] px-1.5 py-0.5 rounded">
                    {type}
                  </code>
                </td>
                <td className="p-2.5 border-b border-[#efe9e2] text-text-soft">
                  {desc}
                </td>
                <td className="p-2.5 border-b border-[#efe9e2] text-text-soft">
                  {best}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Live Examples */}
        <h2 className="text-2xl text-text-primary mb-6 mt-12 pt-8 border-t border-[#efe9e2]">
          Live Examples
        </h2>

        <Example
          title="Bar chart"
          code={`<div data-gorgias="chart" data-chart-type="bar"
  data-chart-config='{
    "title": "AI Agent Adoption Rate by GMV",
    "data": [
      { "label": "$500K", "value": 15.3 },
      { "label": "$1M", "value": 18.7 },
      ...
    ],
    "xAxis": { "label": "GMV" },
    "yAxis": { "label": "Adoption rate", "format": "percent" }
  }'>
</div>`}
        >
          <ChartEmbed type="bar" config={barConfig} />
        </Example>

        <Example
          title="Area chart"
          code={`<div data-gorgias="chart" data-chart-type="area"
  data-chart-config='{
    "title": "First Response Time vs. Automation Rate",
    "source": "Gorgias platform data · March 2026",
    "data": [...],
    "xAxis": { "label": "Automation rate" },
    "yAxis": { "label": "First response time", "format": "minutes" }
  }'>
</div>`}
        >
          <ChartEmbed type="area" config={areaConfig} />
        </Example>

        <Example
          title="Multi-line comparison"
          code={`<div data-gorgias="chart" data-chart-type="multi-line"
  data-chart-config='{
    "title": "Human Team Size vs. AI Equivalents",
    "xAxis": { "label": "Automation rate" },
    "yAxis": { "label": "Agents" },
    "series": [
      { "key": "human", "label": "Human team", "color": "#B5D8CC", "data": [...] },
      { "key": "ai", "label": "AI equivalents", "color": "#CDC2FF", "data": [...] }
    ]
  }'>
</div>`}
        >
          <ChartEmbed type="multi-line" config={multiLineConfig} />
        </Example>

        <Example
          title="Line chart"
          code={`<div data-gorgias="chart" data-chart-type="line"
  data-chart-config='{
    "title": "AI Agent Adoption Over Time",
    "data": [...],
    "xAxis": { "label": "Month" },
    "yAxis": { "label": "Adoption rate", "format": "percent" }
  }'>
</div>`}
        >
          <ChartEmbed type="line" config={lineConfig} />
        </Example>

        {/* Color Palette */}
        <h2 className="text-2xl text-text-primary mb-4 mt-12 pt-8 border-t border-[#efe9e2]">
          Color Palette
        </h2>
        <p className="text-text-soft mb-4">
          Charts use these colors by default. Override with the{" "}
          <code className="font-mono text-[13px] bg-[#efe9e2] px-1.5 py-0.5 rounded">
            colors
          </code>{" "}
          array.
        </p>
        <div className="grid grid-cols-5 gap-3 mb-8">
          {COLORS.map((c) => (
            <div key={c.hex} className="text-center">
              <div
                className="w-full h-10 rounded-lg mb-1.5"
                style={{ backgroundColor: c.hex }}
              />
              <div className="text-xs font-medium text-text-primary">
                {c.name}
              </div>
              <div className="text-[11px] font-mono text-text-soft">
                {c.hex}
              </div>
            </div>
          ))}
        </div>

        {/* Imperative API */}
        <h2 className="text-2xl text-text-primary mb-4 mt-12 pt-8 border-t border-[#efe9e2]">
          Imperative API
        </h2>
        <CodeBlock>{`GorgiasEmbed.render("chart", document.getElementById("my-chart"), {
  type: "bar",
  config: {
    title: "My Chart",
    data: [
      { label: "A", value: 10 },
      { label: "B", value: 25 }
    ]
  }
})

// Named colors available:
GorgiasEmbed.colors.lavender  // "#CDC2FF"
GorgiasEmbed.colors.salmon    // "#FFB5B5"
// ...etc`}</CodeBlock>

      </div>
    </TooltipProvider>
  )
}
