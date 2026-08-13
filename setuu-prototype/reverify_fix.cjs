const fs = require('fs');
const path = require('path');

const roles = {
  admin: {
    title: "Admin Portal",
    sidebar: "AdminSidebar",
    topbar: "AdminTopbar",
    actions: `<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Emergency Lock</button>`
  },
  pm: {
    title: "PM Command Center",
    sidebar: "PMSidebar",
    topbar: "PMTopbar",
    actions: `<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Generate Report</button>`
  },
  engineer: {
    title: "Master Workbench",
    sidebar: "EngineerSidebar",
    topbar: "EngineerTopbar",
    actions: `<button className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-container-high flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Log Time</button>`
  },
  client: {
    title: "Client Portal",
    sidebar: "ClientSidebar",
    topbar: "ClientTopbar",
    actions: ``
  },
  vendor: {
    title: "Supply Portal",
    sidebar: "VendorSidebar",
    topbar: "VendorTopbar",
    actions: `<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> Log Delivery</button>`
  },
  superadmin: {
    title: "Platform Administration",
    sidebar: "SuperadminSidebar",
    topbar: "SuperadminTopbar",
    actions: `<button className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Emergency Override Log</button>`
  }
};

const componentsDir = path.join(process.cwd(), 'src', 'components', 'navigation', 'roles');

for (const [role, config] of Object.entries(roles)) {
  const topbarContent = `import * as React from "react";
import { Topbar } from "@/components/navigation/Topbar";

export function ${config.topbar}({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Topbar 
      title="${config.title}" 
      onMenuClick={onMenuClick}
      actions={
        ${config.actions ? config.actions : `null`}
      }
    />
  );
}
`;
  fs.writeFileSync(path.join(componentsDir, `${config.topbar}.tsx`), topbarContent);
}

const dashboardShellContent = `"use client";
import * as React from "react";
import { usePathname } from "next/navigation";

export function DashboardShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar: (props: { activePath: string; onClick?: () => void }) => React.ReactNode;
  topbar: (props: { onMenuClick: () => void }) => React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface relative">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={\`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        \${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      \`}>
        {sidebar({ activePath: pathname, onClick: () => setIsMobileMenuOpen(false) })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
        {topbar({ onMenuClick: () => setIsMobileMenuOpen(true) })}
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative">
          {children}
        </main>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(process.cwd(), 'src', 'components', 'navigation', 'DashboardShell.tsx'), dashboardShellContent);

const baseDir = path.join(process.cwd(), 'src', 'app', '(dashboard)');
for (const [role, config] of Object.entries(roles)) {
  const layoutContent = `"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { ${config.sidebar} } from "@/components/navigation/roles/${config.sidebar}";
import { ${config.topbar} } from "@/components/navigation/roles/${config.topbar}";

export default function ${role.charAt(0).toUpperCase() + role.slice(1)}Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <${config.sidebar} activePath={activePath} />}
      topbar={({ onMenuClick }) => <${config.topbar} onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
`;
  fs.writeFileSync(path.join(baseDir, role, 'layout.tsx'), layoutContent);
}

// Modify Topbar.tsx to support onMenuClick
const topbarPath = path.join(process.cwd(), 'src', 'components', 'navigation', 'Topbar.tsx');
let topbarCode = fs.readFileSync(topbarPath, 'utf8');
if (!topbarCode.includes('onMenuClick?: () => void')) {
  topbarCode = topbarCode.replace('export interface TopbarProps', 'import { Menu } from "lucide-react";\n\nexport interface TopbarProps');
  topbarCode = topbarCode.replace('actions?: React.ReactNode', 'actions?: React.ReactNode\n  onMenuClick?: () => void');
  topbarCode = topbarCode.replace('export function Topbar({ title, breadcrumbs, actions, className, ...props }: TopbarProps) {', 'export function Topbar({ title, breadcrumbs, actions, className, onMenuClick, ...props }: TopbarProps) {');
  topbarCode = topbarCode.replace('<div className="flex items-center space-x-4">', `<div className="flex items-center space-x-4">
        {onMenuClick && (
          <button 
            className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}`);
  fs.writeFileSync(topbarPath, topbarCode);
}
console.log("Reverification fix applied successfully.");
