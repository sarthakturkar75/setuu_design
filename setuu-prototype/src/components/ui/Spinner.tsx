import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  color?: 'primary' | 'white' | 'sky' | 'emerald' | 'crimson';
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const colorMap = {
  primary: 'text-primary',
  white: 'text-white',
  sky: 'text-semantic-sky',
  emerald: 'text-semantic-emerald',
  crimson: 'text-semantic-crimson'
};

export function Spinner({ size = 'md', label, color = 'primary', className, ...props }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)} {...props}>
      <Loader2 className={cn("animate-spin", sizeMap[size], colorMap[color])} />
      {label && <span className={cn("text-sm font-medium font-sans", colorMap[color])}>{label}</span>}
    </div>
  );
}
