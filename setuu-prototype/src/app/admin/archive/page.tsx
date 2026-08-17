"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { KPICard } from "@/components/ui/KPICard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Archive, Download, Server, FileWarning, ShieldCheck, Scale, RefreshCcw, Trash2, Search } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { TextInput } from "@/components/ui/TextInput";
import { SelectMenu } from "@/components/ui/SelectMenu";
import Link from "next/link";

const mockArchives = [
  { id: "REC-9941", name: "2024 Q1 Financial Ledgers", module: "Financials", date: "Jan 15, 2025", policy: "7-Year Retention", status: "Secure", hold: false },
  { id: "REC-9940", name: "Alpha Tower - Phase 1 Approvals", module: "Projects", date: "Nov 01, 2024", policy: "Permanent", status: "Legal Hold", hold: true },
  { id: "REC-9939", name: "Vendor Contracts (Expired 2023)", module: "Vendors", date: "Dec 31, 2023", policy: "3-Year Retention", status: "Pending Purge", hold: false },
];

export default function ArchiveManagerPage() {
  const columns = [
    { 
      key: "record", 
      header: "Record Identity", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.name}</span>
          <span className="text-xs text-on-surface-variant font-jetbrains">{row.id}</span>
        </div>
      )
    },
    { 
      key: "module", 
      header: "Origin Module", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface-variant">{row.module}</span>
    },
    { 
      key: "policy", 
      header: "Retention Policy",
      cell: (row: any) => <span className="font-medium text-on-surface">{row.policy}</span>
    },
    { 
      key: "date", 
      header: "Archived Date", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.date}</span>
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <StatusBadge 
            tone={row.status === "Secure" ? "emerald" : row.status === "Legal Hold" ? "amber" : "crimson"} 
            label={row.status} 
          />
          {row.hold && <span title="Active Legal Hold"><Scale className="w-4 h-4 text-semantic-amber" /></span>}
        </div>
      )
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1" disabled={row.hold}>
            <RefreshCcw className="w-4 h-4" /> Restore
          </button>
          <button className="text-sm font-semibold text-crimson hover:underline flex items-center gap-1" disabled={row.hold || row.status === "Secure"}>
            <Trash2 className="w-4 h-4" /> Purge
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Archive & Data Retention Manager" 
        subtitle="Manage long-term storage, compliance holds, and automated data purging"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Archive</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <Download className="w-4 h-4" />
            Export Audit
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Total Cold Storage" 
            value="14.2 TB" 
            trend={{ value: 4, label: "from last month", isPositive: false }}
            icon={<Server className="w-5 h-5 text-on-surface-variant" />}
          />
          <KPICard 
            title="Archived Records" 
            value="1,248,091" 
            trend={{ value: 12, label: "from last month", isPositive: true }}
            icon={<Archive className="w-5 h-5 text-on-surface-variant" />}
          />
          <KPICard 
            title="Pending Purge" 
            value="4,210" 
            trend={{ value: 2, label: "due this week", isPositive: false }}
            icon={<FileWarning className="w-5 h-5 text-crimson" />}
          />
          <Card className="p-6 flex items-center justify-between bg-emerald-500/10 border-semantic-emerald/30">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-semantic-emerald uppercase tracking-wider">Compliance Grade</span>
              <span className="text-4xl font-bold text-semantic-emerald mt-1">A+</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface shadow-elevation-l1 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-semantic-emerald" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Legal Holds */}
          <Card className="col-span-1 flex flex-col">
            <div className="p-4 border-b border-outline-variant bg-surface-variant/30 flex items-center justify-between">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <Scale className="w-4 h-4 text-semantic-amber" /> Active Legal Holds
              </h3>
              <span className="text-xs font-bold bg-semantic-amber text-on-primary px-2 py-0.5 rounded-full">3 Active</span>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
              
              <div className="p-4 rounded-lg border border-semantic-amber/50 bg-semantic-amber/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface">Subcontractor Dispute #884</span>
                  <span className="text-xs font-jetbrains text-semantic-amber">HLD-001</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Prevents deletion or modification of any financial or timesheet records related to "Alpha Tower" from Q3 2024 to Q1 2025.
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-semantic-amber/20">
                  <span className="text-xs text-on-surface-variant font-medium">Applied: Oct 12, 2025</span>
                  <button className="text-xs font-semibold text-primary hover:underline">Manage</button>
                </div>
              </div>

            </div>
          </Card>

          {/* Archived Records Table */}
          <Card className="col-span-1 lg:col-span-2 flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">Archived Records Repository</h3>
            </div>
            <FilterBar onClear={() => {}} onApply={() => {}}>
              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <TextInput placeholder="Search record ID or name..." className="pl-9" />
              </div>
              <SelectMenu 
                options={[
                  { label: "All Modules", value: "" },
                  { label: "Financials", value: "fin" },
                  { label: "Projects", value: "proj" },
                  { label: "Vendors", value: "ven" },
                ]}
                value=""
                onChange={() => {}}
              />
            </FilterBar>

            <DataTable 
              data={mockArchives}
              columns={columns}
              getRowId={(row: any) => row.id}
            />
          </Card>

        </div>
      </div>
    </div>
  );
}
