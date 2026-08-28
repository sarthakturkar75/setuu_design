"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getClientApprovals } from "@/app/actions/clientActions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ClientApprovals() {
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    getClientApprovals().then((data) => setApprovals(data || []));
  }, []);

  const columns = [
    { key: "display_id", header: "ID", cell: (r: any) => r.display_id || "—" },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'approved' ? 'emerald' : 'slate'} label={r.status} /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Approvals & Sign-offs" subtitle="Review and approve documents." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={approvals} />
      </Card>
    </div>
  );
}
