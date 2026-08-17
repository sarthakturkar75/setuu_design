import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-outline-variant/50 rounded-xl bg-surface-container-lowest/50">
      {icon && <div className="text-outline mb-4">{icon}</div>}
      <h3 className="text-lg font-merriweather font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm mb-6 max-w-md">{message}</p>
      {action}
    </div>
  );
}
