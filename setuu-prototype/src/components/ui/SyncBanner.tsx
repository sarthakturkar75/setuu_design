import * as React from "react"
import { cn } from "@/lib/utils"

export type SyncState = "offline" | "syncing" | "connected"

export interface SyncBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  state: SyncState
  lastSynced?: Date
}

export function SyncBanner({ state, lastSynced, className, ...props }: SyncBannerProps) {
  const bgClasses = {
    offline: "bg-semantic-amber-bg text-semantic-amber-on",
    syncing: "bg-semantic-sky-bg text-semantic-sky-on",
    connected: "bg-semantic-emerald-bg text-semantic-emerald-on",
  }

  const iconMap = {
    offline: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="M8.53 8.53a9.05 9.05 0 0 1 6.94 6.94"/><path d="M4.27 4.27a17 17 0 0 1 15.46 15.46"/></svg>
    ),
    syncing: (
      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
    ),
    connected: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    )
  }

  const labelMap = {
    offline: "Offline mode. Changes saved locally.",
    syncing: "Syncing changes...",
    connected: `All systems synced${lastSynced ? ` at ${lastSynced.toLocaleTimeString()}` : ''}`
  }

  return (
    <div className={cn("flex items-center justify-center px-4 py-2 text-sm font-inter transition-colors", bgClasses[state], className)} {...props}>
      <span className="mr-2">{iconMap[state]}</span>
      <span className="font-medium">{labelMap[state]}</span>
    </div>
  )
}
