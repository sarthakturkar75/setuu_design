import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
}

export function Modal({ isOpen, onClose, title, description, children, className, ...props }: ModalProps) {
  if (!isOpen) return null;

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
          "relative bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant w-full max-w-lg mx-4 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
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
        
        <div className="p-6 overflow-y-auto font-inter">
          {children}
        </div>
      </div>
    </div>
  )
}
