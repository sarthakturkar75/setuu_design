"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon } from "lucide-react";
import { getTickets } from "@/app/actions/supportActions";

export default function PMSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();
        setTickets(data || []);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTickets();
  }, []);

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

      {isLoading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading support tickets...</div>
      ) : (
        <DataTable
          data={tickets}
          columns={[
            
            { header: "Subject", key: "title", cell: (row: any) => <span className="font-medium text-on-surface">{row.title}</span> },
            { header: "Priority", key: "priority", cell: (row: any) => <>{row.priority}</> },
            { header: "Status", key: "status", cell: (row: any) => <StatusBadge label={row.status} tone={row.status === "Open" ? "amber" : "slate"} /> },
            { header: "Created At", key: "created_at", cell: (row: any) => <>{new Date(row.created_at).toLocaleString()}</> },
          ]}
        />
      )}
    </div>
  );
}
