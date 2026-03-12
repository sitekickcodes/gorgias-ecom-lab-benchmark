import { BenchmarkHeader } from "./benchmark-header"
import { GmvSlider } from "./gmv-slider"
import { AiAgentSection } from "./ai-agent-section"
import { StatGrids } from "./stat-grids"
import { FrtChart } from "./frt-chart"

export function Benchmark() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-start w-full">
      <BenchmarkHeader />
      <div className="flex flex-col gap-8 w-full">
        <GmvSlider />
        <AiAgentSection />
        <StatGrids />
        <FrtChart />
      </div>
    </div>
  )
}
