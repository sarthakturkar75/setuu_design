import * as React from "react"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type="time"
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border bg-surface-container-lowest pl-10 pr-3 py-2 text-sm text-on-surface ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-inter",
            error ? "border-error focus-visible:ring-error" : "border-outline-variant",
            className
          )}
          {...props}
        />
        <Clock className="absolute left-3 top-2.5 h-5 w-5 text-on-surface-variant pointer-events-none" />
      </div>
    )
  }
)
TimePicker.displayName = "TimePicker"
