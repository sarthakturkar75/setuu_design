import React from 'react';
import { cn } from '@/lib/utils';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function DatePicker({ className, error, ...props }: DatePickerProps) {
  return (
    <input
      type="date"
      className={cn(
        "flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 transition-colors font-jetbrains-mono",
        error 
          ? "border-error focus:border-error focus:ring-error" 
          : "border-outline-variant focus:border-primary focus:ring-primary hover:border-outline",
        className
      )}
      {...props}
    />
  );
}
