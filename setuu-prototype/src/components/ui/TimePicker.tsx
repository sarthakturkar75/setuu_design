"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function TimePicker({ label, error, className, ...props }: TimePickerProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full font-sans">
      {label && <label className="text-sm font-semibold text-on-surface">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Clock className="w-4 h-4 text-outline" />
        </div>
        <input
          type="time"
          className={cn(
            "flex w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-3 text-sm text-on-surface ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:ring-error",
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error font-medium mt-1">{error}</span>}
    </div>
  );
}
