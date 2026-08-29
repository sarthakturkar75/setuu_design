"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { TextArea } from "@/components/ui/TextArea";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Toast, toast } from "@/components/ui/Toast";

export default function VendorSupport() {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { getTickets } = await import("@/app/actions/supportActions");
        const data = await getTickets();
        setTickets(data || []);
      } catch (err) { } finally { setLoading(false); }
    }
    load();
  }, []);

  const columns = [
    { key: "id", header: "Ticket ID", cell: (r: any) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "title", header: "Subject", cell: (r: any) => <span className="font-medium">{r.title}</span> },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'Resolved' ? 'emerald' : 'amber'} label={r.status} /> },
    { key: "date", header: "Last Updated", cell: (r: any) => r.date },
    { key: "actions", header: "", cell: (r: any) => <Button variant="ghost" size="sm">View</Button> }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Support Center" subtitle="Get help with the platform and your account." />
        <Button onClick={() => setIsModalOpen(true)}>Raise Ticket</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={tickets} isLoading={false} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Raise Support Ticket">
        <div className="space-y-4">
          <FormField label="Subject"><input name="subject" placeholder="Brief summary of the issue..." className="w-full bg-surface-container border border-outline rounded p-2 text-on-surface" /></FormField>
          <div className="mb-1 text-sm font-medium text-on-surface-variant">Description</div><TextArea placeholder="Provide details..." rows={5} />
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsModalOpen(false);
              toast.success("Support ticket created");
            }}>Submit Ticket</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
