import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number;
  max?: number;
  variant?: "default" | "error" | "dot";
}

export function Badge({ count, max = 99, variant = "error", className, ...props }: BadgeProps) {
  const displayCount = count !== undefined && count > max ? `${max}+` : count;
  
  if (variant === "dot") {
    return (
      <span 
        className={cn("inline-flex w-2 h-2 rounded-full bg-semantic-crimson", className)} 
        {...props} 
      />
    );
  }

  if (!count && count !== 0) return null;
  if (count === 0) return null;

  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center px-1.5 min-w-[1.25rem] h-5 text-[10px] font-bold rounded-full font-jetbrains-mono",
        variant === "error" ? "bg-semantic-crimson text-white" : "bg-primary text-on-primary",
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  )
}
