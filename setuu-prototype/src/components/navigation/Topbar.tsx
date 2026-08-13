import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

export interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
}

export function Topbar({ title, breadcrumbs, actions, className, ...props }: TopbarProps) {
  return (
    <header className={cn("h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-6 sticky top-0 z-10", className)} {...props}>
      <div className="flex items-center space-x-4">
        {breadcrumbs ? (
          <nav className="flex items-center space-x-2 text-sm font-inter">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-outline">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-on-surface-variant hover:text-primary transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-on-surface font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <h2 className="font-merriweather text-xl font-bold text-on-surface">{title}</h2>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
