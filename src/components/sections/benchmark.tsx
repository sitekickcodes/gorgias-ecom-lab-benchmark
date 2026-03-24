import { BenchmarkHeader } from "./benchmark-header"
import { GmvSlider } from "./gmv-slider"
import { AiAgentSection } from "./ai-agent-section"
import { ResponseResolution } from "./response-resolution"
import { StatGrids } from "./stat-grids"
import { FrtChart } from "./frt-chart"
import { BenchmarkProvider } from "./benchmark-context"
import { AccordionSection } from "@/components/accordion-section"

export function Benchmark() {
  return (
    <BenchmarkProvider>
      <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-start w-full">
        <BenchmarkHeader />
        <div className="flex flex-col gap-8 w-full">
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
            subtitle="See how first response time varies across industries and tiers"
          >
            <FrtChart />
          </AccordionSection>
        </div>
      </div>
    </BenchmarkProvider>
  )
}
