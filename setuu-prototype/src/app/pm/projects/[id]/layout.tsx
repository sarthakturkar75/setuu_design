"use client";
import * as React from "react";
import { getProjectFlags, getProjectById, verifyProjectAccess } from "@/app/actions/projectActions";
import { AccessDenied } from "@/components/ui/AccessDenied";
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
  const [flags, setFlags] = React.useState<any>(null);
  const [projectName, setProjectName] = React.useState('Project');
  const [projectStatus, setProjectStatus] = React.useState('Active');
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [verifying, setVerifying] = React.useState(true);
  
  React.useEffect(() => {
    if (id !== "unknown") {
      verifyProjectAccess(id).then(hasAccess => {
        if (!hasAccess) {
          setAccessDenied(true);
          setVerifying(false);
          return;
        }
        getProjectFlags(id).then(res => setFlags(res));
        getProjectById(id).then(p => {
          setProjectName(p?.name || 'Project');
          setProjectStatus(p?.status || 'Active');
        }).catch(() => {});
        setVerifying(false);
      });
    }
  }, [id]);
  const pathname = usePathname();
  const router = useRouter();

  const allTabs = [
    { id: "dashboard", label: "Overview" },
    { id: "timeline", label: "Timeline", flag: "timeline" },
    { id: "milestones", label: "Milestones", flag: "milestones" },
    { id: "changes", label: "Changes", flag: "change_requests" },
    { id: "materials", label: "Materials", flag: "project_materials" },
    { id: "issues", label: "Issues", flag: "project_issues" },
    { id: "drawings", label: "Drawings", flag: "drawing_versions" },
    { id: "collaboration", label: "Collaboration", flag: "collaboration" },
    { id: "team", label: "Team Directory" },
    { id: "handover", label: "Handover", flag: "handover" },
    { id: "config", label: "Configuration" },
    { id: "flags", label: "Module Flags" },
  ];
  const tabs = allTabs.filter(t => !t.flag || !flags || flags[t.flag] !== false);

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

  
  if (verifying) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse w-8 h-8 rounded-full bg-primary/20"></div></div>;
  if (accessDenied) return <AccessDenied returnPath="/pm" />;

  return (
    <div className="flex flex-col space-y-0 w-full min-h-screen">
      <div className="px-6 pt-6 max-w-[1600px] w-full mx-auto pb-4">
        <PageHeader title={projectName} subtitle={projectStatus} />
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
