import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  count?: number;
  viewAllLink?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, count, viewAllLink, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-outline-variant/30 mb-4">
      <div className="flex items-center space-x-3">
        <h2 className="text-xl font-merriweather font-semibold text-on-surface">{title}</h2>
        {count !== undefined && (
          <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full font-jetbrains-mono">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {action}
        {viewAllLink && (
          <Link href={viewAllLink} className="text-primary text-sm font-medium hover:underline">
            View All
          </Link>
        )}
      </div>
    </div>
  );
}
