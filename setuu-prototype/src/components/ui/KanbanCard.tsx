import * as React from "react"
import { cn } from "@/lib/utils"
import { AvatarGroup } from "./AvatarGroup"

export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  id: string;
  assignee?: { id: string; name: string; avatarUrl?: string | null };
  badge?: React.ReactNode;
}

export function KanbanCard({ title, id, assignee, badge, className, ...props }: KanbanCardProps) {
  return (
    <div 
      className={cn(
        "bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-elevation-l1 cursor-grab hover:border-primary/50 transition-colors group",
        className
      )} 
      {...props}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-on-surface-variant font-jetbrains-mono tracking-wider">{id}</span>
        {badge && <div>{badge}</div>}
      </div>
      <h4 className="text-sm font-medium text-on-surface leading-snug mb-4 group-hover:text-primary transition-colors">{title}</h4>
      {assignee && (
        <div className="flex justify-end">
          <AvatarGroup users={[assignee]} size="sm" />
        </div>
      )}
    </div>
  )
}
