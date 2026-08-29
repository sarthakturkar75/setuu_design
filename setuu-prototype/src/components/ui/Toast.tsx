"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-semantic-emerald" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-semantic-royal" />
  };

  const bgs = {
    success: "bg-semantic-emerald-bg/10 border-semantic-emerald/20",
    error: "bg-error-container border-error/20",
    info: "bg-semantic-royal-bg/10 border-semantic-royal/20"
  };

  return (
    <div className={cn("flex w-full max-w-sm overflow-hidden bg-surface border rounded-lg shadow-elevation-l3 pointer-events-auto animate-fade-in-up", bgs[type])}>
      <div className="flex items-start p-4 w-full">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-on-surface font-inter">{title}</p>
          {message && <p className="mt-1 text-sm text-on-surface-variant font-inter">{message}</p>}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md text-on-surface-variant hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => onClose(id)}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// A simple ToastContainer for context usage (can be moved to a context provider later)
export function ToastContainer({ toasts, onClose }: { toasts: Omit<ToastProps, 'onClose'>[], onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[9999] pointer-events-none flex flex-col gap-3 items-center md:items-end md:w-[400px]">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={onClose} />
      ))}
    </div>
  );
}


export const toast = {
  success: (msg: string) => console.log("Success:", msg),
  error: (msg: string) => console.log("Error:", msg),
  info: (msg: string) => console.log("Info:", msg)
};
// (Toast as any).success = (msg: string) => console.log("Success:", msg);
// (Toast as any).error = (msg: string) => console.log("Error:", msg);
// (Toast as any).info = (msg: string) => console.log("Info:", msg);
