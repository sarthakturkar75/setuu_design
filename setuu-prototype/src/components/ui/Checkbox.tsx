import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={cn(
            "w-5 h-5 border-2 rounded transition-colors flex items-center justify-center group-hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-checked:bg-primary peer-checked:border-primary",
            error ? "border-error" : "border-outline-variant bg-surface-container-lowest",
            className
          )}>
            <Check className="w-3.5 h-3.5 text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
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
Checkbox.displayName = "Checkbox"
