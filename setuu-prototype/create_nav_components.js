const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });

const components = {
  'Breadcrumb.tsx': `"use client";
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-on-surface-variant font-inter">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors duration-fast">
              {item.label}
            </Link>
          ) : (
            <span className="text-on-surface font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4 text-outline-variant" />}
        </div>
      ))}
    </nav>
  );
}`,

  'TabBar.tsx': `"use client";

export interface TabItem {
  id: string;
  label: string;
}

export function TabBar({ tabs, activeTab, onChange }: { tabs: TabItem[], activeTab: string, onChange: (id: string) => void }) {
  return (
    <div className="flex space-x-6 border-b border-outline-variant/30 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={\`pb-3 px-1 text-sm font-medium transition-all duration-fast border-b-2 whitespace-nowrap \${
              isActive 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'
            }\`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}`,

  'PageHeader.tsx': `import React from 'react';

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
}`,

  'SectionHeader.tsx': `import React from 'react';
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
}`,

  'BottomSheet.tsx': `"use client";
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
        {(title || onClose) && (
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
}`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(uiDir, filename), content);
  console.log(\`Created \${filename}\`);
}
