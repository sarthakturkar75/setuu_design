import * as React from "react"
import { cn } from "@/lib/utils"
import { Modal } from "./Modal"

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <p className="text-on-surface-variant font-inter mb-6">{description}</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-sm text-on-surface hover:bg-surface-variant transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              isDestructive 
                ? "bg-error text-on-error hover:bg-error/90" 
                : "bg-primary text-on-primary hover:bg-primary/90"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
