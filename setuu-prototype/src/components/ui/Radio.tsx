import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={cn(
            "w-5 h-5 border-2 rounded-full transition-colors flex items-center justify-center group-hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-checked:border-primary",
            error ? "border-error" : "border-outline-variant bg-surface-container-lowest",
            className
          )}>
            <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity scale-50 peer-checked:scale-100 duration-200" />
          </div>
        </div>
        {label && (
          <span className="text-sm font-medium text-on-surface select-none font-inter leading-none">
            {label}
          </span>
        )}
      </label>
    )
  }
)
Radio.displayName = "Radio"
