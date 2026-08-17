import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LogoutButton } from "@/components/navigation/LogoutButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { SyncIndicator } from "@/components/ui/SyncIndicator"
import { Badge } from "@/components/ui/Badge"
import { Menu, Bell, HelpCircle, ShieldAlert, UserCircle } from "lucide-react";

export interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
  onMenuClick?: () => void
  onSearch?: (val: string) => void
  isAdmin?: boolean
}

export function Topbar({ title, breadcrumbs, actions, isAdmin = true, className, onMenuClick, onSearch, ...props }: TopbarProps) {
  return (
    <header className={cn("h-16 border-b border-outline-variant bg-surface-container flex items-center justify-between px-6 sticky top-0 z-10", className)} {...props}>
      <div className="flex items-center space-x-4 flex-1">
        {onMenuClick && (
          <button 
            className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
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
          <h2 className="font-merriweather text-xl font-bold text-on-surface hidden sm:block">{title}</h2>
        )}
      </div>
      
      <div className="flex items-center space-x-4 flex-1 justify-end">
        {onSearch && (
           <div className="hidden md:block w-64 mr-2">
             <SearchInput onSearch={onSearch} placeholder="Global search..." />
           </div>
        )}
        
        {isAdmin && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-semantic-crimson-bg/10 text-semantic-crimson border border-semantic-crimson-bg/20 hover:bg-semantic-crimson hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden lg:inline">Emergency</span>
          </button>
        )}

        <div className="hidden lg:flex items-center space-x-2 pr-2 border-r border-outline-variant/30">
          <SyncIndicator status="synced" />
        </div>

        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors relative">
          <Bell className="w-5 h-5" />
          <Badge count={3} className="absolute top-0 right-0 -mt-1 -mr-1" />
        </button>

        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        <ThemeToggle />
        
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-variant transition-colors">
            <UserCircle className="w-8 h-8 text-outline" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-l2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
            <div className="px-4 py-2 border-b border-outline-variant/30">
              <p className="text-sm font-semibold text-on-surface">John Doe</p>
              <p className="text-xs text-on-surface-variant">Admin</p>
            </div>
            <Link href="/profile" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">Profile</Link>
            <Link href="/settings" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">Settings</Link>
            <div className="border-t border-outline-variant/30 my-1"></div>
            <div className="px-2 pb-1">
              <LogoutButton />
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex items-center space-x-3 border-l border-outline-variant/30 pl-4 ml-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
