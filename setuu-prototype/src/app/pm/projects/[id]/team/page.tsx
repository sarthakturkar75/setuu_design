"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getProjectResources } from "@/app/actions/resourceActions";
import { useParams } from "next/navigation";

export default function ProjectTeamPage() {
  const [team, setTeam] = React.useState<any[]>([]);
  const params = useParams();
  const id = params?.id as string;

  React.useEffect(() => {
    async function fetchTeam() {
      if (!id) return;
      const data = await getProjectResources({ projectId: id });
      setTeam(data);
    }
    fetchTeam();
  }, [id]);

  const columns = [
    { key: "name", header: "Name", cell: (row: any) => <span className="font-medium text-on-surface">{row.name}</span> },
    { key: "resource_type", header: "Role", cell: (row: any) => <>{row.resource_type}</> },
    { key: "allocated_hours", header: "Allocated Hours", cell: (row: any) => <span className="text-sm">{row.allocated_hours} hrs</span> },
    { key: "status", header: "Status", cell: (row: any) => <>{row.status}</> }
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <h2 className="text-xl font-bold font-merriweather text-on-surface mb-6">Team Directory</h2>
      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={team} columns={columns} />
      </div>
    </div>
  );
}
