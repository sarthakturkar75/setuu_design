"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Download, FileText, Activity, ShieldAlert, FileWarning, Search } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { TextInput } from "@/components/ui/TextInput";
import { SelectMenu } from "@/components/ui/SelectMenu";
import Link from "next/link";

const mockThreats = [
  { id: "e3b0c44298fc1c149afbf4c8996fb924", file: "Q3_Invoice_Payload.pdf", status: "Clean", scanner: "ClamAV v0.103", project: "Alpha Tower", timestamp: "2026-10-21 15:01:22 UTC" },
  { id: "8b1a9953c4611296a827abf8c47804d7", file: "blueprint_macro_v2.xlsm", status: "Infected", scanner: "ClamAV v0.103", project: "Beta Complex", timestamp: "2026-10-21 14:55:10 UTC", threatName: "VBA:Downloader-A" },
  { id: "9b74c9897bac770ffc029102a200c5de", file: "site_photo_01.jpg", status: "Clean", scanner: "ClamAV v0.103", project: "Gamma Hub", timestamp: "2026-10-21 13:42:05 UTC" },
  { id: "f2ca1bb6c7e907d06dafe4687e579fce", file: "contract_draft_signed.docx", status: "Quarantined", scanner: "Heuristic Engine", project: "Alpha Tower", timestamp: "2026-10-21 10:15:00 UTC", threatName: "Suspicious PDF payload" },
];

export default function ThreatScanDashboardPage() {
  const columns = [
    { 
      key: "file_hash", 
      header: "File & Hash", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.file}</span>
          <span className="text-xs text-on-surface-variant font-jetbrains truncate max-w-[200px]" title={row.id}>{row.id}</span>
        </div>
      )
    },
    { 
      key: "status", 
      header: "Scan Status", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col gap-1 items-start">
          <StatusBadge 
            tone={row.status === "Clean" ? "emerald" : row.status === "Infected" ? "crimson" : "amber"} 
            label={row.status} 
          />
          {row.threatName && <span className="text-xs font-jetbrains font-bold text-crimson">{row.threatName}</span>}
        </div>
      )
    },
    { 
      key: "scanner", 
      header: "Scanned By", 
      sortable: true,
      cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.scanner}</span>
    },
    { 
      key: "project", 
      header: "Project Context", 
      cell: (row: any) => <span className="text-on-surface">{row.project}</span>
    },
    { 
      key: "timestamp", 
      header: "Timestamp (UTC)", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.timestamp}</span>
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Threat & Virus Scan Dashboard" 
        subtitle="Live feed of ClamAV integrations, payload scans, and quarantined files"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Security</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Threats</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex items-center justify-between border-semantic-emerald/30 bg-emerald-500/5">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-semantic-emerald uppercase tracking-wider">Total Scans (24h)</span>
              <span className="text-3xl font-bold font-jetbrains text-semantic-emerald mt-1">45,102</span>
            </div>
            <Activity className="w-8 h-8 text-semantic-emerald/50" />
          </Card>
          <Card className="p-6 flex items-center justify-between border-crimson/30 bg-crimson/5">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-crimson uppercase tracking-wider">Threats Blocked (24h)</span>
              <span className="text-3xl font-bold font-jetbrains text-crimson mt-1">12</span>
            </div>
            <ShieldAlert className="w-8 h-8 text-crimson/50" />
          </Card>
          <Card className="p-6 flex items-center justify-between border-semantic-amber/30 bg-semantic-amber/5">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-semantic-amber uppercase tracking-wider">Active Quarantines</span>
              <span className="text-3xl font-bold font-jetbrains text-semantic-amber mt-1">3</span>
            </div>
            <FileWarning className="w-8 h-8 text-semantic-amber/50" />
          </Card>
        </div>

        <Card className="flex flex-col flex-1 min-h-[500px]">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-semibold text-on-surface flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-on-surface-variant" /> Live Scan Feed
            </h3>
          </div>
          
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search file name or hash..." className="pl-9" />
            </div>
            <SelectMenu 
              options={[
                { label: "All Statuses", value: "" },
                { label: "Clean", value: "clean" },
                { label: "Infected", value: "infected" },
                { label: "Quarantined", value: "quarantine" },
              ]}
              value=""
              onChange={() => {}}
            />
          </FilterBar>

          <DataTable 
            data={mockThreats}
            columns={columns}
            getRowId={(row: any) => row.id}
          />
          
          <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-variant/30">
            <span className="text-sm text-on-surface-variant">Showing 1 to 4 of 45,102 entries</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">First</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">Prev</button>
              <button className="px-3 py-1.5 border border-primary rounded-md text-sm font-medium bg-primary/10 text-primary">1</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">2</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">Next</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">Last</button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
