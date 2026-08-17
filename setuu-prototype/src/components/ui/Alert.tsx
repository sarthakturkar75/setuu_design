import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'info', title, message, action, className }: AlertProps) {
  const styles = {
    info: {
      bg: "bg-primary-container",
      border: "border-primary-container",
      icon: <Info className="w-5 h-5 text-on-primary-container" />,
      text: "text-on-primary-container",
      title: "text-on-primary-container"
    },
    success: {
      bg: "bg-semantic-emerald-bg",
      border: "border-semantic-emerald",
      icon: <CheckCircle2 className="w-5 h-5 text-semantic-emerald-on" />,
      text: "text-semantic-emerald-on",
      title: "text-semantic-emerald-on"
    },
    warning: {
      bg: "bg-semantic-amber-bg",
      border: "border-semantic-amber",
      icon: <AlertTriangle className="w-5 h-5 text-semantic-amber-on" />,
      text: "text-semantic-amber-on",
      title: "text-semantic-amber-on"
    },
    error: {
      bg: "bg-error-container",
      border: "border-error",
      icon: <XCircle className="w-5 h-5 text-on-error-container" />,
      text: "text-on-error-container",
      title: "text-on-error-container"
    }
  };

  const style = styles[type];

  return (
    <div className={cn("p-4 rounded-lg border", style.bg, style.border, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          {style.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={cn("text-sm font-medium font-inter", style.title)}>
            {title}
          </h3>
          {message && (
            <div className={cn("mt-2 text-sm font-inter opacity-90", style.text)}>
              <p>{message}</p>
            </div>
          )}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
