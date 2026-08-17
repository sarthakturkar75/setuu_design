"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { ListTree, RefreshCcw, Download, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

const mockAuditLogs = [
  { id: "LOG-09941", timestamp: "2026-10-21 14:32:01 UTC", event: "User Role Escalation", actor: "System Administrator", target: "auth.users", ip: "192.168.1.45" },
  { id: "LOG-09940", timestamp: "2026-10-21 14:28:15 UTC", event: "Project Configuration Updated", actor: "Sarah Jenkins", target: "projects.config", ip: "10.0.0.102" },
  { id: "LOG-09939", timestamp: "2026-10-21 14:15:00 UTC", event: "Failed Login Attempt", actor: "Unknown User", target: "auth.sessions", ip: "45.22.109.11" },
  { id: "LOG-09938", timestamp: "2026-10-21 13:55:42 UTC", event: "Document Export (PDF)", actor: "Mike Torres", target: "storage.documents", ip: "10.0.0.104" },
  { id: "LOG-09937", timestamp: "2026-10-21 13:10:21 UTC", event: "Change Request Approved", actor: "Elena Rostova", target: "projects.changes", ip: "10.0.0.108" },
];

export default function SecurityAuditLogPage() {
  const columns = [
    { 
      key: "timestamp", 
      header: "Timestamp (UTC)", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.timestamp}</span>
    },
    { 
      key: "event", 
      header: "Event Description", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface">{row.event}</span>
    },
    { 
      key: "actor", 
      header: "Actor", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface">{row.actor}</span>
    },
    { 
      key: "target", 
      header: "Table Target", 
      cell: (row: any) => <span className="font-jetbrains text-sm text-primary bg-primary/10 px-2 py-1 rounded">{row.target}</span>
    },
    { 
      key: "ip", 
      header: "Source IP",
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.ip}</span>
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Organizational Audit Log" 
        subtitle="Immutable ledger of all administrative and system events"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Security</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Audit</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
              <RefreshCcw className="w-4 h-4" />
              Refresh Stream
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-semantic-emerald/30 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-semantic-emerald" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-jetbrains text-on-surface">12,408</span>
              <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Total Events Recorded</span>
            </div>
          </div>
          <span className="text-sm text-on-surface-variant">
            Stream is live and actively recording to immutable storage.
          </span>
        </div>

        <Card className="flex flex-col flex-1 min-h-[500px]">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-semibold text-on-surface flex items-center gap-2">
              <ListTree className="w-4 h-4 text-on-surface-variant" /> Event Ledger
            </h3>
          </div>
          
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search event, actor, or IP..." className="pl-9" />
            </div>
            <SelectMenu 
              options={[
                { label: "All Event Types", value: "" },
                { label: "Authentication", value: "auth" },
                { label: "Configuration Changes", value: "config" },
                { label: "Data Export", value: "export" },
              ]}
              value=""
              onChange={() => {}}
            />
            <TextInput type="date" placeholder="Start Date" />
            <TextInput type="date" placeholder="End Date" />
          </FilterBar>

          <DataTable 
            data={mockAuditLogs}
            columns={columns}
            getRowId={(row: any) => row.id}
          />
          
          {/* Pagination controls for DataTable */}
          <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-variant/30">
            <span className="text-sm text-on-surface-variant">Showing 1 to 5 of 12,408 entries</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">First</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">Prev</button>
              <button className="px-3 py-1.5 border border-primary rounded-md text-sm font-medium bg-primary/10 text-primary">1</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">2</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">3</button>
              <span className="text-on-surface-variant">...</span>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">Next</button>
              <button className="px-3 py-1.5 border border-outline-variant rounded-md text-sm font-medium bg-surface text-on-surface-variant hover:bg-surface-variant">Last</button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
