"use client";
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-normal",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 w-full max-h-[90vh] glass rounded-t-3xl shadow-elevation-l3 transform transition-transform duration-normal ease-out flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
        </div>
        
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-glassmorphism-border">
            <h2 className="text-lg font-bold font-sans text-on-surface">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant transition-colors">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
        )}
        
        <div className="p-6 overflow-y-auto custom-scrollbar font-sans text-on-surface">
          {children}
        </div>
      </div>
    </>
  );
}
