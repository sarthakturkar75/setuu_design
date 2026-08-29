"use client";
import { useCurrency } from "@/contexts/CurrencyContext";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getChangeRequests } from "@/app/actions/changeRequestActions";
import { Button } from "@/components/ui/Button";

export default function ClientFinancials() {
  const { formatCurrency } = useCurrency();
  const [crs, setCrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getChangeRequests(""); // Empty string gets all accessible CRs
        // Client should only see CRs pending their approval or approved ones
        const filtered = (data || []).filter((cr: any) => ['pending', 'approved', 'rejected'].includes(cr.status));
        setCrs(filtered);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    { key: "display_id", header: "CR Number", cell: (r: any) => <span className="font-mono text-sm">{r.display_id || r.id.substring(0,8)}</span> },
    { key: "project", header: "Project", cell: (r: any) => <span className="font-medium">{r.projects?.name || "Unknown"}</span> },
    { key: "reason", header: "Description", cell: (r: any) => <span className="truncate block max-w-[200px]">{r.reason}</span> },
    { key: "cost", header: "Cost Impact", cell: (r: any) => <span className="font-medium font-mono">${(r.cost_impact || 0).toLocaleString()}</span> },
    { key: "time", header: "Time Impact", cell: (r: any) => <span className="text-on-surface-variant">+{r.time_impact_days || 0} days</span> },
    { key: "status", header: "Status", cell: (r: any) => {
        let tone: any = "slate";
        if (r.status === 'approved') tone = "emerald";
        if (r.status === 'rejected') tone = "crimson";
        if (r.status === 'pending') tone = "amber";
        return <StatusBadge tone={tone} label={r.status} />;
      }
    },
    { key: "actions", header: "", cell: (r: any) => (
      r.status === 'pending' ? (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">Approve</Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">Reject</Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm">View Details</Button>
      )
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Financial Approvals" subtitle="Review and approve project change requests and payment certificates." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-on-surface-variant mb-2">Pending Approvals</div>
          <div className="text-3xl font-bold text-on-surface">{crs.filter(c => c.status === 'pending').length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-on-surface-variant mb-2">Pending Cost Impact</div>
          <div className="text-3xl font-bold text-amber-500 font-mono">
            ${crs.filter(c => c.status === 'pending').reduce((a, b) => a + (b.cost_impact || 0), 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-on-surface-variant mb-2">Approved Changes (YTD)</div>
          <div className="text-3xl font-bold text-emerald-500 font-mono">
            ${crs.filter(c => c.status === 'approved').reduce((a, b) => a + (b.cost_impact || 0), 0).toLocaleString()}
          </div>
        </Card>
      </div>

      <h3 className="font-bold text-lg text-on-surface mb-4">Change Requests</h3>
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={crs} isLoading={loading} />
      </Card>
    </div>
  );
}
