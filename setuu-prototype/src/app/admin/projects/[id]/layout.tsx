"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { TabBar } from "@/components/ui/TabBar";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Settings, CheckSquare } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import * as React from "react";

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string || "unknown";

  const tabs = [
    { id: "dashboard", label: "Overview" },
    { id: "timeline", label: "Timeline" },
    { id: "milestones", label: "Milestones" },
    { id: "materials", label: "Materials" },
    { id: "issues", label: "Issues" },
    { id: "drawings", label: "Drawings" },
    { id: "collaboration", label: "Collaboration" },
    { id: "handover", label: "Handover" },
    { id: "config", label: "Configuration" },
    { id: "flags", label: "Module Flags" },
  ];

  const getHref = (key: string) => {
    if (key === "dashboard") return `/admin/projects/${id}`;
    return `/admin/projects/${id}/${key}`;
  };

  let activeTab = "dashboard";
  for (const tab of tabs) {
    if (tab.id !== "dashboard" && pathname.startsWith(getHref(tab.id))) {
      activeTab = tab.id;
      break;
    }
  }

  return (
    <div className="flex flex-col space-y-0 w-full min-h-screen">
      <div className="px-6 pt-6 max-w-[1600px] w-full mx-auto pb-4">
        <PageHeader 
          title={`Project Workspace`} 
          subtitle="Admin Configuration & Management"
          actions={
            <div className="flex items-center gap-3">
              <Link href={`/admin/projects/${id}/config`} className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          }
        />
        <TabBar 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={(key) => {
            router.push(getHref(key));
          }} 
        />
      </div>

      <div className="flex-1 w-full bg-surface">
        {children}
      </div>
    </div>
  );
}
