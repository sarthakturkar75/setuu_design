"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { getIssues } from "@/app/actions/issueActions";

export default function ProjectIssuesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const [issues, setIssues] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchIssues() {
      setIsLoading(true);
      try {
        const data = await getIssues(id);
        setIssues(data || []);
      } catch (error) {
        console.error("Failed to load issues:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchIssues();
    }
  }, [id]);

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: any) => <span className="font-jetbrains-mono text-xs text-outline">{row.id.substring(0, 8)}...</span>
    },
    {
      key: "title",
      header: "Issue",
      cell: (row: any) => <span className="font-medium text-on-surface">{row.title}</span>
    },
    {
      key: "severity",
      header: "Severity",
      sortable: true,
      cell: (row: any) => {
        const isHigh = row.severity === "High" || row.severity === "Critical";
        const isMed = row.severity === "Medium";
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${isHigh ? "bg-semantic-crimson-bg/10 text-semantic-crimson" : isMed ? "bg-semantic-amber-bg/10 text-semantic-amber" : "bg-semantic-sky-bg/10 text-semantic-sky"}`}>
            {row.severity}
          </span>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => <StatusBadge tone={row.status === "Resolved" || row.status === "Closed" ? "emerald" : row.status === "Open" ? "crimson" : "amber"} label={row.status} />
    },
    {
      key: "assignee",
      header: "Assigned To",
      cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.assignee_name || 'Unassigned'}</span>
    },
    {
      key: "date",
      header: "Date Logged",
      cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}</span>
    }
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

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable data={issues} columns={columns} />
        )}
      </div>
    </div>
  );
}