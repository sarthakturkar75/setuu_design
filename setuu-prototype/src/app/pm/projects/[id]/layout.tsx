"use client";
import * as React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabBar } from "@/components/ui/TabBar";

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params?.id as string || "unknown";
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "timeline", label: "Timeline" },
    { id: "milestones", label: "Milestones" },
    { id: "materials", label: "Materials" },
    { id: "issues", label: "Issues" },
    { id: "drawings", label: "Drawings" },
    { id: "collaboration", label: "Collaboration" },
    { id: "handover", label: "Handover" },
  ];

  const getHref = (key: string) => {
    if (key === "dashboard") return `/pm/projects/${id}`;
    return `/pm/projects/${id}/${key}`;
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
        <PageHeader title={`Project ${id.toUpperCase()}`} subtitle="Active Construction Phase" />
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
