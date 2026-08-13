import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusTone = 'slate' | 'sky' | 'amber' | 'emerald' | 'teal' | 'royal' | 'purple' | 'crimson'

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone
  label: string
}

export function StatusBadge({ tone, label, className, ...props }: StatusBadgeProps) {
  const toneClasses = {
    slate: "bg-semantic-slate-bg text-semantic-slate-on",
    sky: "bg-semantic-sky-bg text-semantic-sky-on",
    amber: "bg-semantic-amber-bg text-semantic-amber-on",
    emerald: "bg-semantic-emerald-bg text-semantic-emerald-on",
    teal: "bg-semantic-teal-bg text-semantic-teal-on",
    royal: "bg-semantic-royal-bg text-semantic-royal-on",
    purple: "bg-semantic-purple-bg text-semantic-purple-on",
    crimson: "bg-semantic-crimson-bg text-semantic-crimson-on",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-jetbrains-mono tracking-wide uppercase transition-colors",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}
