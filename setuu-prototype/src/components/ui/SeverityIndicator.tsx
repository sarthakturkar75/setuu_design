import * as React from "react"
import { cn } from "@/lib/utils"

export type SeverityLevel = "low" | "medium" | "high" | "critical"

export interface SeverityIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: SeverityLevel;
}

export function SeverityIndicator({ level, className, ...props }: SeverityIndicatorProps) {
  const levelConfig = {
    low: { label: "Low", class: "bg-semantic-emerald-bg/10 text-semantic-emerald border-semantic-emerald-bg/20" },
    medium: { label: "Medium", class: "bg-semantic-sky-bg/10 text-semantic-sky border-semantic-sky-bg/20" },
    high: { label: "High", class: "bg-semantic-amber-bg/10 text-semantic-amber border-semantic-amber-bg/20" },
    critical: { label: "Critical", class: "bg-semantic-crimson-bg/10 text-semantic-crimson border-semantic-crimson-bg/20 font-bold" },
  }

  const config = levelConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs border uppercase tracking-wider font-jetbrains-mono",
        config.class,
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  )
}
