"use client";
import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, width = "w-[400px]" }: DrawerProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div 
        className={cn(
          "relative bg-surface-container-lowest h-full shadow-elevation-l3 flex flex-col animate-in slide-in-from-right duration-300",
          width
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h2 className="font-merriweather text-xl font-bold text-on-surface">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}
