import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(minutes: number): string {
  if (minutes < 1) {
    const secs = Math.round(minutes * 60)
    return `${secs}s`
  }
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  // Round to nearest 0.5h
  const hrs = Math.round((minutes / 60) * 2) / 2
  return hrs % 1 === 0 ? `${hrs}h` : `${hrs.toFixed(1)}h`
}
