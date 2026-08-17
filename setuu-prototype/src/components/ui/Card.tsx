import * as React from "react"
import { cn } from "@/lib/utils"

export type CardVariant = "elevated" | "outlined" | "filled"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ className, variant = "elevated", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl text-on-surface transition-shadow",
        {
          "shadow-elevation-l1 bg-surface-container-lowest border border-outline-variant": variant === "elevated",
          "border border-outline-variant bg-transparent": variant === "outlined",
          "bg-surface-container border-none shadow-none": variant === "filled",
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
