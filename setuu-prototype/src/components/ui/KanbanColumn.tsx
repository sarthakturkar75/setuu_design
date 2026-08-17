import * as React from "react"
import { cn } from "@/lib/utils"

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  count?: number;
  children: React.ReactNode;
}

export function KanbanColumn({ title, count, children, className, ...props }: KanbanColumnProps) {
  return (
    <div 
      className={cn(
        "flex flex-col flex-shrink-0 w-80 bg-surface-container-low rounded-xl border border-outline-variant/30 h-full overflow-hidden",
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container">
        <h3 className="font-merriweather font-semibold text-sm text-on-surface uppercase tracking-wider">{title}</h3>
        {count !== undefined && (
          <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full font-jetbrains-mono">
            {count}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {children}
      </div>
    </div>
  )
}
