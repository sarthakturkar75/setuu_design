import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  colorClass?: string;
  heightClass?: string;
}

export function ProgressBar({ progress, label, showPercentage, colorClass = "bg-primary", heightClass = "h-2" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-sm font-inter">
          {label && <span className="font-medium text-on-surface">{label}</span>}
          {showPercentage && <span className="text-on-surface-variant font-jetbrains-mono">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-surface-variant rounded-full overflow-hidden", heightClass)}>
        <div 
          className={cn("h-full transition-all duration-slow ease-out", colorClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
