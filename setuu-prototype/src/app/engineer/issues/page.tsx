"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getIssues } from "@/app/actions/issueActions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function EngineerIssues() {
  const [issues, setIssues] = useState<any[]>([]);
  
  useEffect(() => {
    // Ideally filtered by assignee in the action or we do it here
    getIssues().then(setIssues); 
  }, []);

  const columns = [
    { key: "display_id", header: "ID", cell: (r: any) => r.display_id },
    { key: "title", header: "Title", cell: (r: any) => r.title },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'Closed' ? 'emerald' : 'slate'} label={r.status} /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Issue Tracker" subtitle="Bugs and issues assigned to you." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={issues} />
      </Card>
    </div>
  );
}
