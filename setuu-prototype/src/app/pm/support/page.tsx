"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon } from "lucide-react";

export default function PMSupport() {
  return (
    <div className="p-6 space-y-6 max-w-300 mx-auto">
      <PageHeader
        title="Support Tickets"
        subtitle="Need help with the platform? We've got you covered."
        actions={
          <Button variant="primary">
            <PlusIcon className="w-4 h-4 mr-2" /> Create New Ticket
          </Button>
        }
      />

      <DataTable
        data={mockTickets}
        columns={[
          { header: "Ticket ID", key: "id", cell: (row: any) => <span className="font-mono text-xs text-on-surface-variant font-bold">#{row.id}</span> },
          { header: "Subject", key: "subject", cell: (row: any) => <span className="font-medium text-on-surface">{row.subject}</span> },
          { header: "Category", key: "category", cell: (row: any) => <>{row.category}</> },
          { header: "Status", key: "status", cell: (row: any) => <StatusBadge label={row.status} tone={row.status === "Open" ? "amber" : "slate"} /> },
          { header: "Last Updated", key: "updatedAt", cell: (row: any) => <>{row.updatedAt}</> },
        ]}

      />
    </div>
  );
}

const mockTickets = [
  { id: "T-8092", subject: "Cannot upload PDF to drawing hub", category: "Bug", status: "Open", updatedAt: "2 hours ago" },
  { id: "T-7104", subject: "How to export financials for specific vendor?", category: "Question", status: "Resolved", updatedAt: "3 days ago" },
];
