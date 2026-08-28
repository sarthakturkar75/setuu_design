"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getIssues } from "@/app/actions/issueActions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ClientIssues() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Assuming getIssues() returns all issues if no project provided, or we can just fetch
      const data = await getIssues();
      setIssues(data || []);
      setIsLoading(false);
    }
    load();
  }, []);

  const columns = [
    { key: "display_id", header: "Issue ID", cell: (row: any) => row.display_id || "—" },
    { key: "title", header: "Title", cell: (row: any) => row.title },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge tone={row.status === "Closed" ? "emerald" : "slate"} label={row.status} /> },
    { key: "priority", header: "Priority", cell: (row: any) => <span className="capitalize">{row.priority}</span> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="My Reported Issues" subtitle="Track and manage the issues you have raised." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={issues} isLoading={isLoading} />
      </Card>
    </div>
  );
}
