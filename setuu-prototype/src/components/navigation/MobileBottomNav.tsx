"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, ShieldAlert, LifeBuoy, Menu } from "lucide-react";

export function MobileBottomNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname() || "";

  const navItems = [
    { label: "Dashboard", href: "/superadmin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Orgs", href: "/superadmin/organizations", icon: <Building2 className="w-5 h-5" /> },
    { label: "Security", href: "/superadmin/security", icon: <ShieldAlert className="w-5 h-5" /> },
    { label: "Support", href: "/superadmin/support", icon: <LifeBuoy className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/30 flex justify-around items-center px-2 py-2 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        // Exact match for dashboard
        const isActuallyActive = item.href === "/superadmin" ? pathname === "/superadmin" : isActive;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-16 transition-colors ${isActuallyActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={onMenuClick}
        className="flex flex-col items-center justify-center p-2 rounded-lg min-w-16 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">More</span>
      </button>
    </div>
  );
}
