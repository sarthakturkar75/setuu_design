import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import {
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon,
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, CircleHelpIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";

export function ClientSidebar({ activePath }: { activePath: string }) {
  return (
    <Sidebar
      activePath={activePath}
      logoText="Acme Corp"
      logoSubtext="Client Portal"
      sections={[
        {
          title: "Portfolio",
          items: [
            { label: "Global Dashboard", href: "/client", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
            { label: "Projects Hub", href: "/client/projects", icon: <FolderTreeIcon className="w-5 h-5" /> }
          ]
        },
        {
          title: "Tracking",
          items: [
            { label: "Approvals & Handovers", href: "/client/approvals", icon: <ShieldCheckIcon className="w-5 h-5" /> },
            { label: "Meeting Agendas", href: "/client/meetings", icon: <CalendarIcon className="w-5 h-5" /> },
            { label: "Financials", href: "/client/financials", icon: <DollarSignIcon className="w-5 h-5" /> }
          ]
        }
      ]}
      bottomItems={[]}
    />
  );
}
