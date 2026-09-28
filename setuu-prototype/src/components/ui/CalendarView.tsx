"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  className?: string;
  currentDate?: Date;
}

export function CalendarView({ className, currentDate = new Date() }: CalendarViewProps) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className={cn("glass rounded-xl p-4 font-sans", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-on-surface">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-on-surface-variant py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Placeholder grid for days */}
        {Array.from({ length: 35 }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer",
              i === 15 ? "bg-primary text-on-primary font-bold shadow-elevation-l1" : "text-on-surface hover:bg-surface-container-high"
            )}
          >
            {(i % 31) + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
