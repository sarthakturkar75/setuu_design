import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)} {...props}>
      <div 
        className={cn(
          "rounded-full border-outline-variant/30 border-t-primary animate-spin",
          sizeClasses[size]
        )} 
      />
      {label && <span className="text-sm font-inter text-on-surface-variant font-medium">{label}</span>}
    </div>
  )
}
