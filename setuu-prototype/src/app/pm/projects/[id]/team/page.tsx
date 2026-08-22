"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getProjectResources } from "@/app/actions/resourceActions";
import { getProjectTeam } from "@/app/actions/projectActions";
import { useParams } from "next/navigation";

export default function ProjectTeamPage() {
  const [team, setTeam] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams();
  const id = params?.id as string;

  React.useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [teamData, resourceData] = await Promise.all([
          getProjectTeam(id),
          getProjectResources({ projectId: id })
        ]);
        setTeam(teamData || []);
        setResources(resourceData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const teamColumns = [
    { key: "name", header: "Name", cell: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{row.fallback}</div>
        <span className="font-medium text-on-surface">{row.name}</span>
      </div>
    )},
    { key: "role", header: "Role", cell: (row: any) => <span className="text-sm capitalize">{row.role}</span> },
  ];

  const resourceColumns = [
    { key: "name", header: "Resource", cell: (row: any) => <span className="font-medium text-on-surface">{row.name}</span> },
    { key: "resource_type", header: "Type", cell: (row: any) => <span className="text-sm">{row.resource_type}</span> },
    { key: "allocated_hours", header: "Allocated Hours", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.allocated_hours ?? 0} hrs</span> },
    { key: "actual_hours", header: "Actual Hours", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.actual_hours ?? 0} hrs</span> },
    { key: "current_assignment", header: "Assignment", cell: (row: any) => <span className="text-sm">{row.current_assignment || "Unassigned"}</span> },
  ];

  if (loading) return <div className="p-6 animate-pulse text-on-surface-variant">Loading team data...</div>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold font-merriweather text-on-surface mb-4">Project Team</h2>
        {team.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No team members assigned to this project.</p>
        ) : (
          <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
            <DataTable data={team} columns={teamColumns} />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold font-merriweather text-on-surface mb-4">Resource Allocations</h2>
        {resources.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No resources allocated to this project.</p>
        ) : (
          <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
            <DataTable data={resources} columns={resourceColumns} />
          </div>
        )}
      </div>
    </div>
  );
}
