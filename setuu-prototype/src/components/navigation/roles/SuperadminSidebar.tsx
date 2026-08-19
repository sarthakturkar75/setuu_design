import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import {
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon,
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, CircleHelpIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";

export function SuperadminSidebar({ activePath }: { activePath: string }) {
  return (
    <Sidebar
      activePath={activePath}
      logoText="Praimo"
      logoSubtext="Platform Admin"
      sections={[
        {
          title: "Platform",
          items: [
            { label: "Control Center", href: "/superadmin", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
            { label: "Configuration", href: "/superadmin/platform", icon: <SettingsIcon className="w-5 h-5" /> }
          ]
        },
        {
          title: "Security & Audit",
          items: [
            { label: "Audit Logs", href: "/superadmin/audit", icon: <ShieldCheckIcon className="w-5 h-5" /> },
            { label: "Break-glass Access", href: "/superadmin/security", icon: <LockIcon className="w-5 h-5" /> }
          ]
        },
        {
          title: "Operations",
          items: [
            { label: "Global Support", href: "/superadmin/support", icon: <CircleHelpIcon className="w-5 h-5" /> }
          ]
        }
      ]}
      bottomItems={[]}
    />
  );
}
