import { BenchmarkDashboard } from "./components/benchmark-dashboard"
import { TooltipProvider } from "@/components/tooltip"

export function App() {
  return (
    <TooltipProvider delay={200}>
      <BenchmarkDashboard />
    </TooltipProvider>
  )
}
