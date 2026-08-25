"use client";
import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? 'bg-primary' : 'bg-surface-variant'}
      `}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`
          pointer-events-none block h-4 w-4 rounded-full bg-on-primary shadow-lg ring-0 transition-transform
          ${checked ? 'translate-x-2' : '-translate-x-2'}
        `}
      />
    </button>
  );
}
