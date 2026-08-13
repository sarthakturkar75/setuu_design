"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";
import {
  LayoutDashboardIcon,
  FolderTreeIcon,
  UsersIcon,
  PackageIcon,
  PenToolIcon,
  AlertOctagonIcon,
  ShieldIcon,
  SettingsIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { label: "Projects", href: "/admin/projects", icon: <FolderTreeIcon className="w-5 h-5" /> },
    { label: "Users & Vendors", href: "/admin/users", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Materials", href: "/admin/materials", icon: <PackageIcon className="w-5 h-5" /> },
    { label: "Drawings", href: "/admin/drawings", icon: <PenToolIcon className="w-5 h-5" /> },
    { label: "Issues", href: "/admin/issues", icon: <AlertOctagonIcon className="w-5 h-5" /> },
    { label: "Security & Audit", href: "/admin/security/audit", icon: <ShieldIcon className="w-5 h-5" /> },
    { label: "Settings", href: "/admin/settings", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  // Helper to generate a title based on pathname
  let title = "Executive Dashboard";
  if (pathname.includes("/admin/projects")) title = "Project Tracking Hub";
  if (pathname.includes("/admin/users") || pathname.includes("/admin/vendors") || pathname.includes("/admin/clients")) title = "Directory & Vendors";
  if (pathname.includes("/admin/materials")) title = "Material Tracking";
  if (pathname.includes("/admin/drawings")) title = "Drawing Hub";
  if (pathname.includes("/admin/issues") || pathname.includes("/admin/changes")) title = "Operations & Issues";
  if (pathname.includes("/admin/security") || pathname.includes("/admin/moderation")) title = "Security & Compliance";
  if (pathname.includes("/admin/settings") || pathname.includes("/admin/support") || pathname.includes("/admin/broadcasts") || pathname.includes("/admin/reports")) title = "Administration";

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Persistent Sidebar */}
      <Sidebar items={adminNavItems} activePath={pathname} role="Executive Admin" className="shrink-0" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest">
          {children}
        </main>
      </div>
    </div>
  );
}