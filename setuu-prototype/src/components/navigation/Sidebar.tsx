import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  items?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: NavSection[];
  activePath: string;
  logoText?: string;
  logoSubtext?: string;
  bottomItems?: NavItem[];
}

export function Sidebar({
  sections,
  activePath,
  logoText = "Setuu Enterprise",
  logoSubtext = "Industrial Project Management",
  bottomItems = [],
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[280px] bg-primary-container flex-shrink-0 flex flex-col h-full border-r border-outline-variant/10 shadow-xl z-40",
        className
      )}
      {...props}
    >
      {/* Branding Header */}
      <div className="p-6 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center font-merriweather font-bold text-white shadow-sm border border-white/5 shrink-0">
          {logoText.substring(0, 2).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <h1 className="font-merriweather font-bold text-white text-lg leading-tight tracking-wide truncate">
            {logoText}
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-[#8ba1b5] mt-0.5 font-medium truncate">
            {logoSubtext}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-4 py-2 custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-2">
            {section.title && (
              <h3 className="px-4 mb-2 font-merriweather text-[11px] uppercase tracking-wider text-[#6f89a9]">
                {section.title}
              </h3>
            )}
            <ul className="flex flex-col gap-1">
              {section.items.map((item, itemIdx) => (
                <SidebarItem key={itemIdx} item={item} activePath={activePath} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 px-3 border-t border-white/10 mt-auto flex flex-col gap-1">
        {bottomItems.map((item, idx) => (
          <SidebarItem key={idx} item={item} activePath={activePath} />
        ))}
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#6f89a9] hover:bg-white/5 hover:text-white transition-colors w-full text-left group"
        >
           <LogOutIcon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
           Logout
        </Link>
      </div>
    </aside>
  );
}

function SidebarItem({ item, activePath }: { item: NavItem; activePath: string }) {
  const [isOpen, setIsOpen] = React.useState(
    item.items?.some(subItem => subItem.href && activePath.startsWith(subItem.href)) || false
  );

  const isRouteActive = item.href ? (activePath === item.href || (activePath.startsWith(item.href) && item.href !== '/')) : false;

  if (item.items && item.items.length > 0) {
    return (
      <li className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-[3px] border-transparent",
            "text-[#6f89a9] hover:bg-white/5 hover:text-white"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && <span className="opacity-70 group-hover:opacity-100">{item.icon}</span>}
            {item.label}
          </div>
          <ChevronDownIcon
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <ul className="pl-11 pr-3 py-1 flex flex-col gap-1 border-l border-white/10 ml-6 mt-1">
            {item.items.map((subItem, idx) => {
              const isSubActive = subItem.href && (activePath === subItem.href || activePath.startsWith(subItem.href));
              return (
                <li key={idx}>
                  <Link
                    href={subItem.href || "#"}
                    className={cn(
                      "block py-1.5 text-xs transition-colors",
                      isSubActive ? "text-white font-medium" : "text-[#6f89a9] hover:text-white"
                    )}
                  >
                    {subItem.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="group">
      <Link
        href={item.href || "#"}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-[3px]",
          isRouteActive
            ? "bg-white/10 text-white border-accent"
            : "text-[#6f89a9] hover:bg-white/5 hover:text-white border-transparent"
        )}
      >
        {item.icon && (
          <span className={cn("opacity-70 group-hover:opacity-100", isRouteActive && "opacity-100 text-blue-400")}>
            {item.icon}
          </span>
        )}
        {item.label}
        {item.badge && <span className="ml-auto">{item.badge}</span>}
      </Link>
    </li>
  );
}
