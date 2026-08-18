"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangleIcon } from "lucide-react";

export default function ProjectIssuesPage() {
  const issues = [
    { id: "ISS-001", title: "Foundation crack detected in Sector B", severity: "High", status: "Open", assignee: "Site Admin", date: "Today" },
    { id: "ISS-002", title: "Delayed steel delivery", severity: "Medium", status: "Investigating", assignee: "Jane Doe", date: "Yesterday" }
  ];

  const columns = [
    { key: "id", header: "ID", cell: (row: any) => <span className="font-jetbrains-mono text-xs text-outline">{row.id}</span> },
    { key: "title", header: "Issue", cell: (row: any) => <span className="font-medium text-on-surface">{row.title}</span> },
    {
      key: "severity", header: "Severity", sortable: true, cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${row.severity === "High" ? "bg-semantic-crimson-bg/10 text-semantic-crimson" : row.severity === "Medium" ? "bg-semantic-amber-bg/10 text-semantic-amber" : "bg-semantic-sky-bg/10 text-semantic-sky"}`}>{row.severity}</span>
      )
    },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge tone={row.status === "Resolved" ? "emerald" : row.status === "Open" ? "crimson" : "amber"} label={row.status} /> },
    { key: "assignee", header: "Assigned To", cell: (row: any) => <>{row.assignee}</> },
    { key: "date", header: "Date Logged", cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.date}</span> }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Project Issues</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-semantic-crimson text-white hover:bg-semantic-crimson/90 rounded-lg text-sm font-medium transition-colors">
          <AlertTriangleIcon className="w-4 h-4" />
          Log New Issue
        </button>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={issues} columns={columns} />
      </div>
    </div>
  );
}
