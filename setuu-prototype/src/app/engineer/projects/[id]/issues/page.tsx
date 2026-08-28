"use client";
import React, { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getIssues } from "@/app/actions/issueActions";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function EngineerProjectIssues({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    getIssues(id).then(setIssues);
  }, [id]);

  const columns = [
    { key: "display_id", header: "ID", cell: (r: any) => r.display_id },
    { key: "title", header: "Title", cell: (r: any) => r.title },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'Closed' ? 'emerald' : 'slate'} label={r.status} /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Project Issues" subtitle="Issues within this project." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={issues} />
      </Card>
    </div>
  );
}
