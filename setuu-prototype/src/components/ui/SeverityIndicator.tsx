import * as React from "react"
import { cn } from "@/lib/utils"

// Loosen the type to accept strings from the DB, but fall back gracefully
export type SeverityLevel = "low" | "medium" | "high" | "critical" | string;

export interface SeverityIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: SeverityLevel;
}

export function SeverityIndicator({ level, className, ...props }: SeverityIndicatorProps) {
  // Graceful fallback to 'medium' if level is undefined or null
  const normalizedLevel = (level || "medium").toLowerCase() as "low" | "medium" | "high" | "critical";

  const levelConfig = {
    low: { label: "Low", class: "bg-semantic-emerald-bg/10 text-semantic-emerald border-semantic-emerald-bg/20" },
    medium: { label: "Medium", class: "bg-semantic-sky-bg/10 text-semantic-sky border-semantic-sky-bg/20" },
    high: { label: "High", class: "bg-semantic-amber-bg/10 text-semantic-amber border-semantic-amber-bg/20" },
    critical: { label: "Critical", class: "bg-semantic-crimson-bg/10 text-semantic-crimson border-semantic-crimson-bg/20 font-bold" },
  }

  // Ensure config exists (fallback again if somehow invalid string passed)
  const config = levelConfig[normalizedLevel] || levelConfig.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] border uppercase tracking-wider font-jetbrains font-bold",
        config.class,
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  )
}