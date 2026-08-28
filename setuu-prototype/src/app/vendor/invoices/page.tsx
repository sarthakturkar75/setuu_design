"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getInvoices } from "@/app/actions/invoiceActions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function VendorInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    getInvoices().then(setInvoices);
  }, []);

  const columns = [
    { key: "display_id", header: "Invoice #", cell: (r: any) => r.display_id || "—" },
    { key: "amount", header: "Amount", cell: (r: any) => `$${r.total_amount?.toLocaleString() || 0}` },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'paid' ? 'emerald' : 'slate'} label={r.status} /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Invoicing & Payments" subtitle="Track your invoices." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={invoices} />
      </Card>
    </div>
  );
}
