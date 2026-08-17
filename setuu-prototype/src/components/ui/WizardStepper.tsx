import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface WizardStep {
  label: string;
  isCompleted?: boolean;
}

export interface WizardStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: WizardStep[];
  currentStep: number;
}

export function WizardStepper({ steps, currentStep, className, ...props }: WizardStepperProps) {
  return (
    <div className={cn("flex items-center w-full", className)} {...props}>
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isPast = idx < currentStep || step.isCompleted;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                  isPast ? "bg-primary text-on-primary" : 
                  isActive ? "bg-primary-container text-on-primary-container ring-2 ring-primary ring-offset-2" : 
                  "bg-surface-variant text-on-surface-variant"
                )}
              >
                {isPast ? <Check className="w-4 h-4" strokeWidth={3} /> : idx + 1}
              </div>
              <span className={cn(
                "absolute top-10 whitespace-nowrap text-xs font-inter font-medium transition-colors",
                isActive || isPast ? "text-on-surface" : "text-on-surface-variant"
              )}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 bg-surface-variant relative z-0">
                <div 
                  className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out" 
                  style={{ width: isPast ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
