"use client";
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-surface w-full rounded-t-3xl shadow-elevation-l3 animate-fade-in-up max-h-[90vh] flex flex-col">
        <div className="flex justify-center p-3">
          <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
        </div>
        {(title || onClose !== undefined) && (
          <div className="flex items-center justify-between px-6 pb-4 border-b border-outline-variant/30">
            <h3 className="font-merriweather font-semibold text-lg text-on-surface">{title}</h3>
            <button onClick={onClose} className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
