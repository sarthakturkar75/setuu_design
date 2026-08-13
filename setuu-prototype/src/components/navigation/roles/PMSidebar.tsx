import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon, 
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, HelpCircleIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";

export function PMSidebar({ activePath }: { activePath: string }) {
  return (
    <Sidebar 
      activePath={activePath}
      logoText="Setuu Enterprise"
      logoSubtext="Project Management"
      sections={[
      {
        title: "Overview",
        items: [
          { label: "Command Center", href: "/pm", icon: <LayoutDashboardIcon className="w-5 h-5" /> }
        ]
      },
      {
        title: "Operations",
        items: [
          { 
            label: "Active Projects", 
            icon: <FolderTreeIcon className="w-5 h-5" />,
            items: [
              { label: "Alpha Tower Build", href: "/pm/projects" },
              { label: "Sector 7 Pipeline", href: "/pm/projects" },
              { label: "Refinery Expansion", href: "/pm/projects" }
            ]
          },
          { label: "Milestones & Tasks", href: "/pm/milestones", icon: <CheckSquareIcon className="w-5 h-5" /> },
          { label: "Drawings & Media", href: "/pm/drawings", icon: <FileBoxIcon className="w-5 h-5" /> },
          { label: "Material Tracking", href: "/pm/inventory", icon: <PackageIcon className="w-5 h-5" /> },
          { label: "Issues & Blockers", href: "/pm/issues", icon: <AlertTriangleIcon className="w-5 h-5" />, badge: <span className="bg-error text-white text-[10px] font-label px-2 py-0.5 rounded-full">3</span> }
        ]
      },
      {
        title: "Client & Admin",
        items: [
          { label: "Handovers & Approvals", href: "/pm/handovers", icon: <ShieldCheckIcon className="w-5 h-5" /> },
          { label: "Support Tickets", href: "/pm/support", icon: <HelpCircleIcon className="w-5 h-5" /> }
        ]
      }
    ]}
      bottomItems={[]}
    />
  );
}
