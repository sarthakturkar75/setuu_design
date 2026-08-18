"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Users, ShieldAlert, Menu, Plus } from "lucide-react";

export function AdminMobileBottomNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname() || "";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Projects", href: "/admin/projects", icon: <FolderKanban className="w-5 h-5" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Security", href: "/admin/security", icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <Link
          href="/admin/projects/new"
          className="flex items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-elevation-l3 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/30 flex justify-around items-center px-2 py-2 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] glass">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // Exact match for dashboard
          const isActuallyActive = item.href === "/admin" ? pathname === "/admin" : isActive;

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
    </>
  );
}
