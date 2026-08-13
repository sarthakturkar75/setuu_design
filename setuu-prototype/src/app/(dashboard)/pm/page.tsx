import { createClient } from "@/lib/supabase/server";
import { KPICard } from "@/components/ui/KPICard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { AlertCircleIcon, FileIcon, TrendingUpIcon, MapPinIcon } from "lucide-react";

export const metadata = {
  title: "PM Command Center | Setuu",
};

export default async function PMDashboardPage() {
  const supabase = await createClient();

  // Fetch assigned projects for the PM
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      target_completion_date,
      created_at
    `)
    .order("target_completion_date", { ascending: true });

  const activeProjects = (projects || []).filter(p => p.status !== "Completed").length;
  
  // Note: in a real application, these counts would be fetched via dedicated aggregates or views
  const criticalTasksCount = 14; 
  const pendingMilestones = 8;
  const recentUpdates = 24;

  return (
    <div className="p-6 max-w-[100rem] mx-auto space-y-8 w-full pb-20 pt-8">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">PM Command Center</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Tactical overview of all assigned deployments and pending field actions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Active Projects" 
          value={activeProjects.toString()}
          trend={{ value: 1, label: "this month", isPositive: true }}
          icon={<FolderIcon className="w-5 h-5 text-primary" />} 
        />
        <KPICard 
          title="Critical Tasks" 
          value={criticalTasksCount.toString()}
          trend={{ value: 5, label: "Needs attention", isPositive: false }}
          icon={<AlertCircleIcon className="w-5 h-5 text-semantic-crimson" />} 
        />
        <KPICard 
          title="Pending Milestones" 
          value={pendingMilestones.toString()}
          trend={{ value: 12, label: "Next 7 days", isPositive: true }}
          icon={<MapPinIcon className="w-5 h-5 text-semantic-amber" />} 
        />
        <KPICard 
          title="Recent Updates" 
          value={recentUpdates.toString()}
          trend={{ value: 8, label: "Last 24 hours", isPositive: true }}
          icon={<TrendingUpIcon className="w-5 h-5 text-semantic-emerald" />} 
        />
      </div>

      {/* Project Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-on-surface font-merriweather">Assigned Deployments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(projects || []).map((project: any) => (
            <Link key={project.id} href={`/pm/projects/${project.id}/milestones`} className="block group">
              <div className="bg-surface-container rounded-xl border border-outline-variant p-5 hover:border-primary/50 transition-colors h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-jetbrains-mono text-xs text-on-surface-variant uppercase tracking-wider">
                      {project.id.substring(0, 8)}
                    </span>
                    <StatusBadge 
                      tone={project.status === "In Progress" ? "sky" : project.status === "On Hold" ? "amber" : "slate"} 
                      label={project.status || "Planning"} 
                    />
                  </div>
                  <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {project.name}
                  </h3>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-sm">
                  <div className="text-on-surface-variant">
                    Target: <span className="font-jetbrains-mono text-on-surface">{new Date(project.target_completion_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-primary font-medium flex items-center gap-1 group-hover:underline">
                    View Project <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {(!projects || projects.length === 0) && (
            <div className="col-span-full py-12 text-center bg-surface-container border border-outline-variant rounded-xl border-dashed">
              <FileIcon className="w-8 h-8 text-on-surface-variant mx-auto mb-3" />
              <p className="text-on-surface font-medium">No projects assigned</p>
              <p className="text-on-surface-variant text-sm mt-1">You currently have no active project deployments.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Dummy icon to fulfill the KPI card needs since FolderIcon isn't standard in lucide export directly by that exact name in some versions (though it usually is, just playing it safe)
function FolderIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
    </svg>
  );
}