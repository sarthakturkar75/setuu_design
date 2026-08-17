"use client";

import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Paintbrush, 
  PackageSearch, 
  AlertOctagon, 
  Clock, 
  GitPullRequest, 
  FileBarChart, 
  Store, 
  ShieldAlert, 
  ListTree, 
  Radio, 
  Archive, 
  Handshake, 
  Settings, 
  LifeBuoy, 
  Activity,
  Plus
} from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: "",
      items: [
        { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
        { 
          label: "Projects", 
          href: "/admin/projects", 
          icon: <FolderKanban className="w-5 h-5" />,
          isExpandable: true,
          children: [
            { label: "Tracking Hub", href: "/admin/projects" },
            { label: "New Project", href: "/admin/projects/new" },
            { label: "Configuration", href: "/admin/projects/config-hub" }
          ]
        },
        { label: "Users & Vendors", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
        { label: "Drawings & Media", href: "/admin/drawings", icon: <Paintbrush className="w-5 h-5" /> },
        { label: "Inventory / Materials", href: "/admin/materials", icon: <PackageSearch className="w-5 h-5" /> },
        { label: "Issues & Blockers", href: "/admin/issues", icon: <AlertOctagon className="w-5 h-5" /> },
        { label: "Resources & Timesheets", href: "/admin/resources", icon: <Clock className="w-5 h-5" /> },
        { label: "Change Requests", href: "/admin/changes", icon: <GitPullRequest className="w-5 h-5" /> },
        { label: "Reports", href: "/admin/reports", icon: <FileBarChart className="w-5 h-5" /> },
        { 
          label: "Vendors", 
          href: "/admin/vendors", 
          icon: <Store className="w-5 h-5" />,
          isExpandable: true,
          children: [
            { label: "Directory", href: "/admin/vendors" },
            { label: "Performance Audit", href: "/admin/vendors/performance" }
          ]
        },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Audit Log", href: "/admin/security/audit", icon: <ListTree className="w-5 h-5" /> },
        { label: "Broadcasts", href: "/admin/broadcasts", icon: <Radio className="w-5 h-5" /> },
        { label: "Archive & Retention", href: "/admin/archive", icon: <Archive className="w-5 h-5" /> },
        { 
          label: "Security", 
          href: "/admin/security", 
          icon: <ShieldAlert className="w-5 h-5" />,
          isExpandable: true,
          children: [
            { label: "Threats & Scans", href: "/admin/security/threats" },
            { label: "Duplicate Files", href: "/admin/security/duplicates" },
            { label: "Upload Dropzone", href: "/admin/security/dropzone" },
            { label: "Force Logout", href: "/admin/security/logout" }
          ]
        },
        { 
          label: "Client", 
          href: "/admin/clients", 
          icon: <Handshake className="w-5 h-5" />,
          isExpandable: true,
          children: [
            { label: "Onboarding", href: "/admin/clients/onboarding" },
            { label: "Approvals Tracker", href: "/admin/clients/approvals" },
            { label: "Moderation Feed", href: "/admin/moderation" }
          ]
        },
        { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
        { label: "Support", href: "/admin/support", icon: <LifeBuoy className="w-5 h-5" /> },
      ],
    },
  ];

  const bottomItems = [
    { label: "System Status", href: "/admin/status", icon: <Activity className="w-5 h-5 text-semantic-emerald" /> },
    { label: "New Project", href: "/admin/projects/new", icon: <Plus className="w-5 h-5 text-primary" /> },
  ];

  return (
    <Sidebar
      logoText="Setuu Enterprise"
      logoSubtext="System Administration"
      sections={sections}
      activePath={pathname || "/admin"}
      bottomItems={bottomItems}
    />
  );
}
