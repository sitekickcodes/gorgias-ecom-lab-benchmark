import { GmvSlider } from "./gmv-slider"
import { AiAgentSection } from "./ai-agent-section"
import { ResponseResolution } from "./response-resolution"
import { StatGrids } from "./stat-grids"
import { FrtChart } from "./frt-chart"
import { BenchmarkProvider, useBenchmark } from "./benchmark-context"
import { AccordionSection } from "@/components/accordion-section"

function BenchmarkInner() {
  const { containerRef } = useBenchmark()
  return (
      <div ref={containerRef} className="flex flex-col gap-5 w-full">
          <GmvSlider />
          <AiAgentSection />
          <AccordionSection
            title="CX Benchmarks"
            subtitle="Response times, satisfaction scores, ticket volume, and channel mix"
          >
            <div className="flex flex-col gap-8">
              <ResponseResolution />
              <StatGrids />
            </div>
          </AccordionSection>
          <AccordionSection
            title="Compare Industries"
            subtitle="Compare any metric across industries — click the chart title to switch metrics"
          >
            <FrtChart />
          </AccordionSection>
      </div>
  )
}

export function Benchmark() {
  return (
    <BenchmarkProvider>
      <BenchmarkInner />
    </BenchmarkProvider>
  )
}
