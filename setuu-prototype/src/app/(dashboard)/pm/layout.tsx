"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";
import {
  LayoutDashboardIcon,
  FolderTreeIcon,
  CloudOffIcon,
  HelpCircleIcon,
  FileTextIcon
} from "lucide-react";

export default function PmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pmNavItems = [
    { label: "Command Center", href: "/pm", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { label: "My Projects", href: "/pm/projects", icon: <FolderTreeIcon className="w-5 h-5" /> },
    { label: "Offline Sync", href: "/pm/sync", icon: <CloudOffIcon className="w-5 h-5" /> },
    { label: "Reporting", href: "/pm/reports", icon: <FileTextIcon className="w-5 h-5" /> },
    { label: "Help Desk", href: "/pm/support", icon: <HelpCircleIcon className="w-5 h-5" /> },
  ];

  // Title generation
  let title = "PM Command Center";
  if (pathname.includes("/pm/projects")) title = "Project Execution";
  if (pathname.includes("/pm/sync")) title = "Offline Sync Queue";
  if (pathname.includes("/pm/reports")) title = "Automated Reporting";
  if (pathname.includes("/pm/support")) title = "Support Portal";

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar items={pmNavItems} activePath={pathname} role="Project Manager" className="shrink-0" />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar title={title} />
        {/* Project context shell (if applicable) will render inside children via nested layout */}
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative">
          {children}
        </main>
      </div>
    </div>
  );
}