import * as React from "react"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"

export type SyncState = "offline" | "syncing" | "connected" | "queued" | "failed"

export interface SyncBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  state: SyncState
  lastSynced?: Date
  onRetry?: () => void
}

export function SyncBanner({ state, lastSynced, onRetry, className, ...props }: SyncBannerProps) {
  const bgClasses = {
    offline: "bg-surface-container-highest text-on-surface-variant border-b border-outline-variant",
    syncing: "bg-surface-container text-semantic-sky border-b border-outline-variant",
    connected: "bg-surface-container text-semantic-emerald border-b border-outline-variant hidden",
    queued: "bg-surface-container text-semantic-amber border-b border-semantic-amber animate-[pulse-crimson_2s_infinite] shadow-[inset_0px_-2px_0px_var(--semantic-amber)]",
    failed: "bg-semantic-crimson-bg/10 text-semantic-crimson border-b border-semantic-crimson-bg/20"
  }

  const iconMap = {
    offline: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="M8.53 8.53a9.05 9.05 0 0 1 6.94 6.94"/><path d="M4.27 4.27a17 17 0 0 1 15.46 15.46"/></svg>
    ),
    syncing: (
      <div className="w-2 h-2 rounded-full bg-semantic-sky animate-ping" />
    ),
    connected: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    ),
    queued: (
      <div className="w-2 h-2 rounded-full bg-semantic-amber animate-pulse" />
    ),
    failed: (
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    )
  }

  const labelMap = {
    offline: "Offline mode. Changes saved locally.",
    syncing: "Syncing changes...",
    connected: `All systems synced${lastSynced ? ` at ${lastSynced.toLocaleTimeString()}` : ''}`,
    queued: "Changes queued for sync.",
    failed: "Sync failed."
  }

  if (state === "connected") return null;

  return (
    <div className={cn("flex items-center justify-center px-4 py-2 text-sm font-inter transition-colors", bgClasses[state], className)} {...props}>
      <span className="mr-2 flex items-center justify-center min-w-[16px]">{iconMap[state]}</span>
      <span className="font-medium flex-1 text-center md:text-left">{labelMap[state]}</span>
      
      {(state === "failed" || state === "offline" || state === "queued") && onRetry && (
        <button 
          onClick={onRetry}
          className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  )
}
