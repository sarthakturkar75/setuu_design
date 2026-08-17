import * as React from "react"
import { cn } from "@/lib/utils"

export type ModalSize = "sm" | "md" | "lg" | "xl" | "fullscreen"

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  description?: string
  size?: ModalSize
  footer?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, description, size = "md", footer, children, className, ...props }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    fullscreen: "max-w-[95vw] h-[95vh]"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop Level 3 (40% black) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className={cn(
          "relative bg-surface-container-lowest rounded-xl border border-outline-variant w-full mx-4 flex flex-col shadow-elevation-l3 animate-fade-in-up",
          size === "fullscreen" ? sizeClasses[size] : `max-h-[90vh] ${sizeClasses[size]}`,
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant flex-shrink-0">
          <div>
            <h2 className="font-merriweather text-xl font-bold text-on-surface">{title}</h2>
            {description && (
              <p className="font-inter text-sm text-on-surface-variant mt-1">
                {description}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto font-inter flex-1 custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-outline-variant bg-surface-container/50 rounded-b-xl flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
