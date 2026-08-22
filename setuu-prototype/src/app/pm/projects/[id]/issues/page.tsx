"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { getIssues, updateIssueStatus, deleteIssue } from "@/app/actions/issueActions";
import { useToast } from "@/contexts/ToastContext";

export default function ProjectIssuesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const toast = useToast();

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

  const handleResolve = async (issueId: string, projectId: string) => {
    try {
      const res = await updateIssueStatus(issueId, projectId, 'Resolved');
      if (res.success) {
        toast.success("Issue resolved");
        const data = await getIssues(id);
        setIssues(data || []);
      } else {
        toast.error(res.error || "Failed to resolve issue");
      }
    } catch (e) {
      toast.error("Failed to resolve issue");
    }
  };

  const handleDelete = async (issueId: string) => {
    if (!window.confirm("Delete this issue?")) return;
    try {
      const res = await deleteIssue(issueId);
      if (res?.success) {
        setIssues(i => i.filter(x => x.id !== issueId));
        toast.success("Issue deleted");
      } else {
        toast.error(res?.error || "Failed to delete issue");
      }
    } catch (e) {
      toast.error("Failed to delete issue");
    }
  };

  const columns = [
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
    },
    {
      key: "actions",
      header: "",
      cell: (row: any) => (
        <div className="flex gap-2 justify-end">
          {row.status === "Open" && (
            <button 
              onClick={() => handleResolve(row.id, row.project_id)}
              className="text-semantic-emerald hover:bg-semantic-emerald/10 px-2 py-1 rounded text-sm font-medium transition-colors"
            >
              Resolve
            </button>
          )}
          <button 
            onClick={() => handleDelete(row.id)}
            className="text-semantic-crimson hover:bg-semantic-crimson/10 px-2 py-1 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      )
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
        {issues.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-on-surface-variant">
            <p>No issues logged for this project.</p>
          </div>
        ) : (
          <DataTable data={issues} columns={columns} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}