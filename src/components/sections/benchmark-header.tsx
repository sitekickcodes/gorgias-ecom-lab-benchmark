import { SectionTag } from "@/components/section-tag"

export function BenchmarkHeader() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 sm:max-w-[512px]">
      <SectionTag number="01" label="Live index" />
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.2] text-text-primary">
          CX Benchmark explorer
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#1a1e23]">
          Interpolated CX metrics by industry, annual sales, and automation
          rate. Data from the last 90 days across ecommerce stores.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-[#1a1e23]">
          Applies to AI Adoption Index, CX Benchmarks, and Compare Industries.
        </p>
      </div>
    </div>
  )
}
