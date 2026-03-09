import { Benchmark } from "./sections/benchmark"

export function BenchmarkDashboard() {
  return (
    <div className="border-t border-dashed border-border-soft flex flex-col items-center px-4 sm:px-10 md:px-20">
      <div className="border-l border-r border-dashed border-border-soft max-w-[1440px] w-full px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-20">
        <Benchmark />
      </div>
    </div>
  )
}
