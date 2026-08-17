import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface KPICardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
  semanticColor?: "slate" | "sky" | "amber" | "emerald" | "teal" | "royal" | "purple" | "crimson"
  href?: string
  sparklineData?: number[]
}

export function KPICard({ title, value, trend, icon, className, semanticColor, href, sparklineData }: KPICardProps) {
  const semanticClass = semanticColor ? `bg-semantic-${semanticColor}-bg/10 border-semantic-${semanticColor}-bg/20` : ""
  
  const content = (
    <Card className={cn("overflow-hidden transition-all duration-normal", semanticClass, href && "hover:shadow-elevation-l2 hover:border-primary/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-on-surface-variant font-inter">
          {title}
        </CardTitle>
        {icon && <div className={cn("text-on-surface-variant", semanticColor && `text-semantic-${semanticColor}`)}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold font-jetbrains-mono tracking-tight text-on-surface">
              {value}
            </div>
            {trend && (
              <p className="text-xs mt-1 font-inter flex items-center">
                <span
                  className={cn(
                    "font-semibold mr-1",
                    trend.isPositive ? "text-semantic-emerald" : "text-semantic-crimson"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-on-surface-variant">
                  {trend.label}
                </span>
              </p>
            )}
          </div>
          {sparklineData && (
            <div className="w-16 h-8 flex items-end justify-between gap-[1px]">
              {sparklineData.map((val, i) => {
                const max = Math.max(...sparklineData);
                const height = max > 0 ? (val / max) * 100 : 0;
                return (
                  <div key={i} className={cn("w-full rounded-t-sm", semanticColor ? `bg-semantic-${semanticColor}` : "bg-primary/50")} style={{ height: `${height}%` }} />
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href} className="block w-full">{content}</Link>
  }
  return content
}
