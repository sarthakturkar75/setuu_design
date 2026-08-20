import * as React from "react"
import { cn } from "@/lib/utils"
import { AvatarGroup } from "./AvatarGroup"

export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  id: string;
  assignee?: { id: string; name: string; avatarUrl?: string | null };
  badge?: React.ReactNode;
  onDelete?: (e: React.MouseEvent) => void;
}

export function KanbanCard({ title, id, assignee, badge, onDelete, className, ...props }: KanbanCardProps) {
  return (
    <div 
      className={cn(
        "bg-surface-container-lowest p-4 rounded-lg border border-outline-variant shadow-elevation-l1 cursor-grab hover:border-primary/50 transition-colors group relative",
        className
      )} 
      {...props}
    >
      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-2 right-2 p-1 text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-semantic-crimson transition-all rounded-md hover:bg-semantic-crimson/10"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      )}
      <div className="flex justify-between items-start mb-2 pr-6">
        <span className="text-[10px] font-bold text-on-surface-variant font-jetbrains-mono tracking-wider">{id.substring(0, 8)}</span>
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
