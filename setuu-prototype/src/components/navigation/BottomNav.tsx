import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BottomNavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BottomNavItem[]
  activePath: string
}

export function BottomNav({ items, activePath, className, ...props }: BottomNavProps) {
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 h-16 glass flex items-center justify-around z-50 md:hidden", className)} {...props}>
      {items.slice(0, 5).map((item) => {
        const isActive = activePath.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive 
                ? "text-primary" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <div className={cn(
              "p-1 rounded-full",
              isActive && "bg-primary/10"
            )}>
              {item.icon}
            </div>
            <span className="text-[10px] font-inter font-medium leading-none">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
