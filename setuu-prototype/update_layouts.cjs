const fs = require('fs');
const path = require('path');

const roles = {
  admin: {
    title: "Admin Portal",
    sidebar: "AdminSidebar",
    actions: `<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Emergency Lock</button>`
  },
  pm: {
    title: "PM Command Center",
    sidebar: "PMSidebar",
    actions: `<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Generate Report</button>`
  },
  engineer: {
    title: "Master Workbench",
    sidebar: "EngineerSidebar",
    actions: `<button className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-container-high flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Log Time</button>`
  },
  client: {
    title: "Client Portal",
    sidebar: "ClientSidebar",
    actions: ``
  },
  vendor: {
    title: "Supply Portal",
    sidebar: "VendorSidebar",
    actions: `<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> Log Delivery</button>`
  },
  superadmin: {
    title: "Platform Administration",
    sidebar: "SuperadminSidebar",
    actions: `<button className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Emergency Override Log</button>`
  }
};

const baseDir = path.join(process.cwd(), 'src', 'app', '(dashboard)');

for (const [role, config] of Object.entries(roles)) {
  const content = `"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { ${config.sidebar} } from "@/components/navigation/roles/${config.sidebar}";
import { Topbar } from "@/components/navigation/Topbar";

export default function ${role.charAt(0).toUpperCase() + role.slice(1)}Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <${config.sidebar} activePath={pathname} />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar 
          title="${config.title}" 
          actions={
            ${config.actions ? config.actions : `null`}
          }
        />
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative">
          {children}
        </main>
      </div>
    </div>
  );
}
`;
  const layoutPath = path.join(baseDir, role, 'layout.tsx');
  fs.writeFileSync(layoutPath, content);
  console.log(`Updated ${layoutPath}`);
}
