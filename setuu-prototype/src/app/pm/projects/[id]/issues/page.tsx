"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getIssues } from "@/app/actions/issueActions";

export default function ProjectIssuesPage() {
  const params = useParams();
  const id = params?.id as string;

  const [issues, setIssues] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (id) {
      getIssues(id).then(setIssues);
    }
  }, [id]);

  const columns = [
    { key: "id", header: "ID", cell: (row: any) => <span className="font-jetbrains-mono text-xs text-outline">{row.id}</span> },
    { key: "title", header: "Issue", cell: (row: any) => <span className="font-medium text-on-surface">{row.title}</span> },
    {
      key: "severity", header: "Severity", sortable: true, cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${row.severity === "High" ? "bg-semantic-crimson-bg/10 text-semantic-crimson" : row.severity === "Medium" ? "bg-semantic-amber-bg/10 text-semantic-amber" : "bg-semantic-sky-bg/10 text-semantic-sky"}`}>{row.severity}</span>
      )
    },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge tone={row.status === "Resolved" ? "emerald" : row.status === "Open" ? "crimson" : "amber"} label={row.status} /> },
    { key: "assignee", header: "Assigned To", cell: (row: any) => <>{row.assignee_name || 'Unassigned'}</> },
    { key: "date", header: "Date Logged", cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}</span> }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Project Issues</h2>
        <Link href={`/pm/projects/${id}/issues/new`} className="flex items-center gap-2 px-4 py-2 bg-semantic-crimson text-white hover:bg-semantic-crimson/90 rounded-lg text-sm font-medium transition-colors">
          <AlertTriangleIcon className="w-4 h-4" />
          Log New Issue
        </Link>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={issues} columns={columns} />
      </div>
    </div>
  );
}
