import { GmvSlider } from "./gmv-slider"
import { AiAgentSection } from "./ai-agent-section"
import { ResponseResolution } from "./response-resolution"
import { StatGrids } from "./stat-grids"
import { CompareChart } from "./compare-chart"
import { BenchmarkProvider, useBenchmark } from "./benchmark-context"
import { AccordionSection } from "@/components/accordion-section"
import type { BenchmarkData } from "@/lib/types"

function BenchmarkInner() {
  const { containerRef, dataset, industry } = useBenchmark()
  // Remounting these subtrees on dataset/industry change replays the same
  // entry animations the user saw on first load (gauge arc fills, count-ups,
  // line draw-in). CompareChart is keyed internally so its metric-selector
  // state survives the swap.
  const replay = `${dataset}-${industry}`
  return (
      <div ref={containerRef} className="flex flex-col gap-5 w-full">
          <GmvSlider />
          <AccordionSection
            title="AI Adoption Index"
            subtitle="How ecommerce stores are adopting and performing with AI"
          >
            <AiAgentSection key={replay} />
          </AccordionSection>
          <AccordionSection
            title="CX Benchmarks"
            subtitle="Response times, satisfaction scores, ticket volume, and channel mix"
          >
            <div key={replay} className="flex flex-col gap-8">
              <ResponseResolution />
              <StatGrids />
            </div>
          </AccordionSection>
          <AccordionSection
            title="Compare Industries"
            subtitle="Compare metrics across industries. Select an industry above to highlight it on the CX Benchmark dashboard, and click a chart title below to switch metrics."
          >
            <CompareChart />
          </AccordionSection>
      </div>
  )
}

export function Benchmark({ initialData }: { initialData?: BenchmarkData }) {
  return (
    <BenchmarkProvider initialData={initialData}>
      <BenchmarkInner />
    </BenchmarkProvider>
  )
}
