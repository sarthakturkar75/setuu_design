"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
}

export function Select({ options, value, defaultValue, onChange, placeholder = "Select an option", disabled, name, required }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || "");
  const ref = useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === currentValue);

  return (
    <div className="relative w-full" ref={ref}>
      {name && <input type="hidden" name={name} value={currentValue} required={required} />}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-surface border rounded-lg transition-colors duration-fast font-inter",
          isOpen ? "border-primary ring-1 ring-primary" : "border-outline-variant hover:border-outline",
          disabled ? "opacity-50 cursor-not-allowed bg-surface-variant" : "cursor-pointer"
        )}
      >
        <span className={selectedOption ? "text-on-surface" : "text-on-surface-variant"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-outline-variant transition-transform duration-normal", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-l2 max-h-60 overflow-y-auto py-1 animate-fade-in-up">
          {options.map((option) => {
            const isSelected = option.value === currentValue;
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-sm text-left font-inter transition-colors hover:bg-surface-container-low",
                  isSelected ? "bg-primary/5 text-primary font-medium" : "text-on-surface"
                )}
                onClick={() => {
                  if (onChange) onChange(option.value);
                  setInternalValue(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
