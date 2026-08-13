import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon, 
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, HelpCircleIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";

export function AdminSidebar({ activePath }: { activePath: string }) {
  return (
    <Sidebar 
      activePath={activePath}
      logoText="Setuu Enterprise"
      logoSubtext="System Administration"
      sections={[
      {
        items: [
          { label: "Dashboard", href: "/admin", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
          { label: "Projects", href: "/admin/projects", icon: <FolderTreeIcon className="w-5 h-5" /> },
          { label: "Users", href: "/admin/users", icon: <UsersIcon className="w-5 h-5" /> },
          { label: "Drawings", href: "/admin/drawings", icon: <FileBoxIcon className="w-5 h-5" /> },
          { label: "Inventory", href: "/admin/inventory", icon: <PackageIcon className="w-5 h-5" /> },
          { label: "Vendors", href: "/admin/vendors", icon: <BuildingIcon className="w-5 h-5" /> },
          { label: "Settings", href: "/admin/settings", icon: <SettingsIcon className="w-5 h-5" /> },
          { label: "Raise Ticket", href: "/admin/support", icon: <TicketIcon className="w-5 h-5" /> }
        ]
      }
    ]}
      bottomItems={[
      { label: "System Status", href: "/admin/status", icon: <ActivityIcon className="w-5 h-5" /> }
    ]}
    />
  );
}
