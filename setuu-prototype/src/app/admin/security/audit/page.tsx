"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { ListTree, RefreshCcw, Download, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuditLogs } from "@/app/actions/auditActions";

export default function SecurityAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (e) {
        console.error("Failed to load audit logs", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  const columns = [
    { 
      key: "created_at", 
      header: "Timestamp (UTC)", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.created_at ? new Date(row.created_at).toLocaleString() : "Unknown"}</span>
    },
    { 
      key: "event_type", 
      header: "Event Description", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface">{row.event_type}</span>
    },
    { 
      key: "user_actor", 
      header: "Actor", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface">{row.user_actor?.display_name || "System"}</span>
    },
    { 
      key: "table_name", 
      header: "Table Target", 
      cell: (row: any) => <span className="font-jetbrains text-sm text-primary bg-primary/10 px-2 py-1 rounded">{row.table_name || "N/A"}</span>
    },
    { 
      key: "ip_address", 
      header: "Source IP",
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.ip_address || "Unknown"}</span>
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
              <TextInput placeholder="Search event, actor, or IP..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select 
              options={[
                { label: "All Event Types", value: "" },
                { label: "Authentication", value: "auth" },
                { label: "Configuration Changes", value: "config" },
                { label: "Data Export", value: "export" },
              ]}
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
            />
            <TextInput type="date" placeholder="Start Date" />
            <TextInput type="date" placeholder="End Date" />
          </FilterBar>

          {loading ? (
            <div className="p-12 text-center text-on-surface-variant">Loading audit logs...</div>
          ) : (
            <DataTable 
              data={logs}
              columns={columns}
              getRowId={(row: any) => row.id}
            />
          )}
          
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
