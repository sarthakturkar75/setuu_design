"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({ 
  icon = <Plus className="w-6 h-6" />, 
  label,
  className, 
  ...props 
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-20 right-4 md:hidden z-40">
      <button
        className={cn(
          "flex items-center justify-center bg-primary text-on-primary rounded-full shadow-elevation-3 hover:shadow-elevation-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
          label ? "px-4 py-3 gap-2" : "w-14 h-14",
          className
        )}
        {...props}
      >
        {icon}
        {label && <span className="font-medium tracking-wide">{label}</span>}
      </button>
    </div>
  );
}
