"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { TabBar } from "@/components/ui/TabBar";
import { usePathname } from "next/navigation";
import { Settings, CheckSquare } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const { id } = use(params);

  // Determine active tab based on pathname
  const activeTab = pathname.endsWith('/config') ? 'Config' 
                  : pathname.endsWith('/flags') ? 'Flags' 
                  : 'Overview';

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title={`Alpha Tower (${id})`} 
        subtitle="Commercial High-Rise Development"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/projects" className="hover:text-primary transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">{id}</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <CheckSquare className="w-4 h-4" />
              Quick Action
            </button>
            <Link href={`/admin/projects/${id}/config`} className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        }
      />
      
      <div className="px-6 border-b border-outline-variant bg-surface-container">
        <TabBar 
          tabs={[
            { id: 'Overview', label: 'Overview' },
            { id: 'Milestones', label: 'Milestones' },
            { id: 'Timeline', label: 'Timeline' },
            { id: 'Materials', label: 'Materials' },
            { id: 'Drawings', label: 'Drawings' },
            { id: 'Issues', label: 'Issues' },
            { id: 'Config', label: 'Configuration' },
            { id: 'Flags', label: 'Module Flags' },
          ]}
          activeTab={activeTab}
          onChange={(tabId: string) => {
            // Real implementation would route here. 
            // In layout, we generally want link-based tabs, but TabBar uses onClick.
            // For prototype purposes, we can navigate manually if needed.
            if (typeof window !== "undefined") {
              const basePath = `/admin/projects/${id}`;
              if (tabId === 'Overview') window.location.href = basePath;
              else if (tabId === 'Config') window.location.href = `${basePath}/config`;
              else if (tabId === 'Flags') window.location.href = `${basePath}/flags`;
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
