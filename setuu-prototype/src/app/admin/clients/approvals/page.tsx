"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FilterBar } from "@/components/ui/FilterBar";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { TextInput } from "@/components/ui/TextInput";
import { Card } from "@/components/ui/Card";
import { Clock, Search, ShieldCheck, Download, AlertTriangle, Scale, Banknote, HardHat } from "lucide-react";
import Link from "next/link";

const mockApprovals = [
  { id: "APP-4402", item: "Change Order #42 - Foundation Steel", requester: "Sarah Jenkins", pending: "Finance Dept.", waitTime: "48 hours", priority: "High", status: "SLA Breach", type: "Finance" },
  { id: "APP-4401", item: "Safety Protocol Revision B", requester: "Mike Torres", pending: "Legal Counsel", waitTime: "12 hours", priority: "Medium", status: "In Review", type: "Legal" },
  { id: "APP-4400", item: "Phase 3 Blueprint V4 Release", requester: "Elena Rostova", pending: "Lead Architect", waitTime: "4 hours", priority: "Critical", status: "Pending", type: "Technical" },
  { id: "APP-4399", item: "Subcontractor Payment - Oct", requester: "John Doe", pending: "Project Manager", waitTime: "24 hours", priority: "Low", status: "Pending", type: "Finance" },
];

export default function ClientApprovalsPage() {
  const columns = [
    { 
      key: "item", 
      header: "Approval Request", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.item}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-jetbrains text-on-surface-variant bg-surface-variant/50 px-1.5 py-0.5 rounded">{row.id}</span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              {row.type === "Finance" && <Banknote className="w-3 h-3 text-semantic-emerald" />}
              {row.type === "Legal" && <Scale className="w-3 h-3 text-primary" />}
              {row.type === "Technical" && <HardHat className="w-3 h-3 text-semantic-amber" />}
              {row.type}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: "requester", 
      header: "Requester", 
      sortable: true,
      cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.requester}</span>
    },
    { 
      key: "pending", 
      header: "Pending Approver(s)", 
      cell: (row: any) => <span className="text-sm font-medium text-primary">{row.pending}</span>
    },
    { 
      key: "waitTime", 
      header: "Wait Time", 
      sortable: true,
      cell: (row: any) => (
        <div className={`flex items-center gap-1.5 text-sm font-jetbrains font-bold ${row.status === "SLA Breach" ? "text-crimson" : "text-on-surface-variant"}`}>
          <Clock className="w-4 h-4" />
          {row.waitTime}
        </div>
      )
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "SLA Breach" ? "crimson" : row.status === "In Review" ? "emerald" : "amber"} 
          label={row.status} 
        />
      )
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          Nudge <span className="hidden sm:inline">Approver</span>
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Cross-Client Approvals Tracker" 
        subtitle="Global visibility into pending multi-party authorizations and SLA compliance"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Clients</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Approvals</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <Download className="w-4 h-4" />
            Export SLA Report
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        {/* KPI Warning Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 flex flex-col justify-between border-crimson/30 bg-crimson/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-crimson uppercase tracking-wider">SLA Breaches</span>
              <AlertTriangle className="w-5 h-5 text-crimson" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold font-jetbrains text-crimson leading-none">12</span>
              <span className="text-sm font-medium text-crimson mb-1">active</span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col justify-between border-semantic-amber/30 bg-semantic-amber/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-semantic-amber uppercase tracking-wider">At Risk (Next 4h)</span>
              <Clock className="w-5 h-5 text-semantic-amber" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold font-jetbrains text-semantic-amber leading-none">8</span>
              <span className="text-sm font-medium text-semantic-amber mb-1">requests</span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col justify-between border-outline-variant bg-surface">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Pending</span>
              <ShieldCheck className="w-5 h-5 text-on-surface-variant" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold font-jetbrains text-on-surface leading-none">148</span>
              <span className="text-sm font-medium text-on-surface-variant mb-1">in queue</span>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between border-outline-variant bg-surface">
             <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg Wait Time</span>
                <div className="w-full bg-outline-variant/30 rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-full rounded-full w-[45%]" />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="font-jetbrains font-bold text-on-surface">18 hrs</span>
                  <span className="text-on-surface-variant">SLA: 48h</span>
                </div>
             </div>
             
             <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-outline-variant">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Worst Bottleneck</span>
                <span className="text-sm font-semibold text-primary truncate" title="Finance Dept. (Alpha Tower)">Finance Dept. (Alpha Tower)</span>
             </div>
          </Card>
        </div>

        <Card className="flex flex-col flex-1 min-h-[500px]">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-semibold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-on-surface-variant" /> Master Approvals Ledger
            </h3>
          </div>
          
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search ID, item, or person..." className="pl-9" />
            </div>
            <SelectMenu 
              options={[
                { label: "All Types", value: "" },
                { label: "Finance", value: "fin" },
                { label: "Technical", value: "tech" },
                { label: "Legal", value: "leg" },
              ]}
              value=""
              onChange={() => {}}
            />
            <SelectMenu 
              options={[
                { label: "All Statuses", value: "" },
                { label: "Pending", value: "pending" },
                { label: "In Review", value: "review" },
                { label: "SLA Breach", value: "breach" },
              ]}
              value=""
              onChange={() => {}}
            />
          </FilterBar>

          <DataTable 
            data={mockApprovals}
            columns={columns}
            getRowId={(row: any) => row.id}
          />
        </Card>

      </div>
    </div>
  );
}
