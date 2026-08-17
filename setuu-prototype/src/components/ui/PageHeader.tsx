import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex flex-col space-y-2">
        {breadcrumb && <div>{breadcrumb}</div>}
        <h1 className="text-3xl font-merriweather font-bold text-on-surface">{title}</h1>
        {subtitle && <p className="text-on-surface-variant text-sm">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center space-x-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
