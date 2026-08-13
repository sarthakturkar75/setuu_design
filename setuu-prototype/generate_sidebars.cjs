const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'components', 'navigation', 'roles');
fs.mkdirSync(dir, { recursive: true });

const sidebars = {
  AdminSidebar: {
    logoText: "Setuu Enterprise",
    logoSubtext: "System Administration",
    sections: `[
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
    ]`,
    bottomItems: `[
      { label: "System Status", href: "/admin/status", icon: <ActivityIcon className="w-5 h-5" /> }
    ]`
  },
  PMSidebar: {
    logoText: "Setuu Enterprise",
    logoSubtext: "Project Management",
    sections: `[
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
    ]`,
    bottomItems: `[]`
  },
  EngineerSidebar: {
    logoText: "Setuu Enterprise",
    logoSubtext: "Engineering Workspace",
    sections: `[
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
    ]`,
    bottomItems: `[]`
  },
  ClientSidebar: {
    logoText: "Acme Corp",
    logoSubtext: "Client Portal",
    sections: `[
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
    ]`,
    bottomItems: `[]`
  },
  VendorSidebar: {
    logoText: "Vendor Portal",
    logoSubtext: "Supply Chain",
    sections: `[
      {
        items: [
          { label: "Dispatch Dashboard", href: "/vendor", icon: <TruckIcon className="w-5 h-5" /> },
          { label: "Deliveries", href: "/vendor/deliveries", icon: <PackageIcon className="w-5 h-5" /> },
          { label: "Defects & Rework", href: "/vendor/defects", icon: <AlertTriangleIcon className="w-5 h-5" /> },
          { label: "Invoicing", href: "/vendor/invoices", icon: <DollarSignIcon className="w-5 h-5" /> }
        ]
      }
    ]`,
    bottomItems: `[]`
  },
  SuperadminSidebar: {
    logoText: "Praimo",
    logoSubtext: "Platform Admin",
    sections: `[
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
          { label: "Global Support", href: "/superadmin/support", icon: <HelpCircleIcon className="w-5 h-5" /> }
        ]
      }
    ]`,
    bottomItems: `[]`
  }
};

const imports = `import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon, 
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, HelpCircleIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";
`;

for (const [name, config] of Object.entries(sidebars)) {
  const content = `${imports}
export function ${name}({ activePath }: { activePath: string }) {
  return (
    <Sidebar 
      activePath={activePath}
      logoText="${config.logoText}"
      logoSubtext="${config.logoSubtext}"
      sections={${config.sections}}
      bottomItems={${config.bottomItems}}
    />
  );
}
`;
  fs.writeFileSync(path.join(dir, `${name}.tsx`), content);
  console.log(`Created ${name}.tsx`);
}
