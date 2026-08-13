import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[];
  activePath: string;
  role: string;
}

export function Sidebar({
  items,
  activePath,
  role,
  className,
  ...props
}: SidebarProps) {
  return (
    <div
      className={cn(
        "w-64 border-r border-outline-variant bg-surface flex flex-col h-full",
        className,
      )}
      {...props}
    >
      <div className="p-6 border-b border-outline-variant">
        <h1 className="font-merriweather font-bold text-xl text-primary">
          Setuu
        </h1>
        <p className="font-jetbrains-mono text-xs uppercase text-on-surface-variant tracking-wider mt-1">
          {role} Portal
        </p>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = activePath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium font-inter transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-outline-variant">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-3"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Settings
        </Link>
      </div>
    </div>
  );
}
