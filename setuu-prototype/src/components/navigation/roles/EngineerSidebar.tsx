import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon, 
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, HelpCircleIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";

export function EngineerSidebar({ activePath }: { activePath: string }) {
  return (
    <Sidebar 
      activePath={activePath}
      logoText="Setuu Enterprise"
      logoSubtext="Engineering Workspace"
      sections={[
      {
        items: [
          { label: "Workbench", href: "/engineer", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
          { label: "My Projects", href: "/engineer/projects", icon: <FolderTreeIcon className="w-5 h-5" /> },
          { label: "Tasks & Execution", href: "/engineer/tasks", icon: <CheckSquareIcon className="w-5 h-5" /> },
          { label: "Issues Log", href: "/engineer/issues", icon: <AlertTriangleIcon className="w-5 h-5" /> },
          { label: "Drawings", href: "/engineer/drawings", icon: <FileBoxIcon className="w-5 h-5" /> },
          { label: "Timesheet", href: "/engineer/timesheet", icon: <ClockIcon className="w-5 h-5" /> }
        ]
      }
    ]}
      bottomItems={[]}
    />
  );
}
