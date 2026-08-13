import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 1 | 2 | 3;
}

export function Card({ className, elevation = 1, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface",
        {
          "shadow-none": elevation === 1,
          "shadow-md backdrop-blur-md bg-opacity-90": elevation === 2,
          "shadow-xl": elevation === 3,
        },
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-merriweather text-lg font-bold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("font-inter text-sm text-on-surface-variant", className)}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0 font-inter", className)} {...props} />
  )
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}
