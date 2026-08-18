import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboardIcon, FolderTreeIcon, FileBoxIcon, 
  PackageIcon, HelpCircleIcon, AlertTriangleIcon, CheckSquareIcon,
  ShieldCheckIcon, MessageSquareIcon, WifiOffIcon, BookOpenIcon, 
  FileTextIcon, CalendarIcon
} from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface PMSidebarProps {
  activePath: string;
  projects?: Project[];
}

export function PMSidebar({ activePath, projects = [] }: PMSidebarProps) {
  const projectItems = projects.length > 0 
    ? projects.map(p => ({ label: p.name, href: `/pm/projects/${p.id}` }))
    : [
        { label: "Alpha Tower Build", href: "/pm/projects/1" },
        { label: "Beta Site", href: "/pm/projects/2" },
        { label: "Gamma Facility", href: "/pm/projects/3" }
      ]; // Fallback for skeleton/preview

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
              href: "/pm/projects",
              icon: <FolderTreeIcon className="w-5 h-5" />,
              items: projectItems
            },
            { label: "Milestones & Tasks", href: "/pm/milestones", icon: <CheckSquareIcon className="w-5 h-5" /> },
            { label: "Drawings & Media", href: "/pm/drawings", icon: <FileBoxIcon className="w-5 h-5" /> },
            { label: "Material Tracking", href: "/pm/inventory", icon: <PackageIcon className="w-5 h-5" /> },
            { label: "Issues & Blockers", href: "/pm/issues", icon: <AlertTriangleIcon className="w-5 h-5" /> },
            { label: "Collaboration", href: "/pm/projects/default/collaboration", icon: <MessageSquareIcon className="w-5 h-5" /> },
            { label: "Offline Sync Queue", href: "/pm/sync", icon: <WifiOffIcon className="w-5 h-5" />, badge: <span className="bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">2</span> }
          ]
        },
        {
          title: "Client & Admin",
          items: [
            { label: "Handovers & Meetings", href: "/pm/handovers", icon: <ShieldCheckIcon className="w-5 h-5" /> },
            { label: "Lessons Learned", href: "/pm/lessons", icon: <BookOpenIcon className="w-5 h-5" /> },
            { label: "Reporting", href: "/pm/reports", icon: <FileTextIcon className="w-5 h-5" /> },
            { label: "Support Tickets", href: "/pm/support", icon: <HelpCircleIcon className="w-5 h-5" /> }
          ]
        }
      ]}
      bottomItems={[
        { label: "View Calendar", href: "/pm/calendar", icon: <CalendarIcon className="w-5 h-5" /> }
      ]}
    />
  );
}
