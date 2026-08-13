import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { cn } from "@/lib/utils"

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
}

export function KPICard({ title, value, trend, icon, className }: KPICardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-on-surface-variant font-inter">
          {title}
        </CardTitle>
        {icon && <div className="text-on-surface-variant">{icon}</div>}
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
