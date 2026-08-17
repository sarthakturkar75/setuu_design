import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, tooltip, error, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <div className="flex items-center space-x-2">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-on-surface font-inter">
          {label}
        </label>
        {tooltip && (
          <div className="group relative flex items-center">
            <Info className="w-4 h-4 text-outline-variant hover:text-on-surface-variant transition-colors" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 bg-surface-container-highest text-on-surface text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-elevation-l1">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs text-error font-medium font-inter mt-1">{error}</p>
      )}
    </div>
  );
}
