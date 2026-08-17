import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarViewProps extends React.HTMLAttributes<HTMLDivElement> {
  currentDate?: Date;
}

export function CalendarView({ currentDate = new Date(), className, ...props }: CalendarViewProps) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Very simplistic calendar grid for prototype
  const days = Array.from({ length: 35 }, (_, i) => i + 1 - 4); 

  return (
    <div className={cn("w-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden", className)} {...props}>
      <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-container">
        <h3 className="font-merriweather font-semibold text-on-surface">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="grid grid-cols-7 border-b border-outline-variant">
        {daysOfWeek.map(day => (
          <div key={day} className="p-2 text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-inter">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[100px]">
        {days.map((day, idx) => (
          <div 
            key={idx} 
            className={cn(
              "p-2 border-r border-b border-outline-variant/30 hover:bg-surface-variant transition-colors relative",
              idx % 7 === 6 ? "border-r-0" : "",
              idx >= 28 ? "border-b-0" : "",
              day <= 0 || day > 31 ? "bg-surface-container-highest/50 text-outline" : "bg-surface-container-lowest text-on-surface"
            )}
          >
            <span className={cn(
              "text-sm font-jetbrains-mono inline-flex w-6 h-6 items-center justify-center rounded-full",
              day === currentDate.getDate() ? "bg-primary text-on-primary font-bold" : ""
            )}>
              {day > 0 && day <= 31 ? day : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
